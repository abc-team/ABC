var plugin = require('./plugin');
var async = require('async');
var _ = require('underscore');
var events = require('events');
var util = require('util');
var utils = require('./utils/');

/**
 * ABC 执行系统
 * @param abcJSON
 * @return {ABC}
 * @constructor
 */
function ABC(abcJSON) {
    var self = this;

    if (!(self instanceof ABC)) {
        return new ABC(abcJSON)
    }

    self.utils = utils;
    //config
    self.initConfigs(abcJSON);

    //plugins
    self.pluginManager = new plugin.PluginManager(self);

    if (abcJSON.plugins) {
        self.pluginManager.addMap(abcJSON.plugins);
    }

    var plugins = self._analyticsPlugin(self._queues);

    self.pluginManager.loadPlugins(plugins);
}

_.extend(ABC, {

    /**
     * init a abc.json file
     * @param config
     * @param config.path the path to init
     * @param config.name the name of config file
     * @param callback
     */
    init: function(config, callback){
        callback(null);
    }
});

_.extend(ABC.prototype, events.EventEmitter, {
    /**
     * parse json object
     * @param json {Object}
     * @param json.config {Object}
     * @param json.plugins {Object}
     * @param json.tasks {Object}
     */
    initConfigs: function(json) {
        var self = this;

        var tasks = json.tasks || {'default': []};
        self._queues = {};


        //parse tasks
        var taskNames = _.keys(tasks);

        _.each(taskNames, function (name) {
            var q = self._parseTask(tasks[name]);

            if(q) {
                self._queues[name] = q;
            }
        });

        //deliver configs
        var config = utils.embedObject(json.config || {}, json['var'] || {});

        taskNames = _.keys(self._queues);

        _.each(taskNames, function(name){

            var q = self._queues[name];
            self._queues[name] = q.map(function(task) {
                if (task.name === 'task') {
                    //no task
                    if (taskNames.indexOf(task.name) === -1) {
                        throw new Error(util.format('No task found for %s:%s in task %s', task.type, task.name, name))
                    }
                }

                if (!(_.has(config, task.type)) || !(_.has(config[task.type], task.name))) {
                    var msg = util.format('No config found %s:%s in task %s', task.type, task.name, name);
                    throw new Error(msg);
                }

                task.config = _.clone(config[task.type][task.name]);
                return task;
            });
        });
        console.log('queue');
        console.log(self._queues);
    },


    /**
     * Parse Queue object
     * @param queue {Array} array of string
     * @return Array array of parse task
     * @private
     */
    _parseTask: function(queue) {
        return _.chain(queue)
            .map(function(task) {
                var sp = task.match(/^([^:]+):(.*)$/);
                var ret;

                if (sp) {
                    ret = {
                        type: sp[1],
                        name: sp[2],
                        source: task
                    };
                } else {
                    ret = null;
                }

                return ret;
            })
            .compact()
            .value();
    },

    /**
     * get Config for Plugin by type and name
     * @param name {String}
     * @return {*}
     */
    getQueue: function(name) {
        var self = this;;
        return self._queues[name];
    },

    _analyticsPlugin: function(queue) {
        var self = this;
        var plugins = _.chain(queue)
            .pairs()
            .map(function(p){
                return _.chain(p[1])
                    .map(function(task){
                        return task.type;
                    })
                    .compact()
                    .unique()
                    .value();
            })
            .flatten()
            .value();
        return plugins;
    },

    warning: function(){

    },

    log: function(){

    },

    error: function () {

    },

    /**
     * execute a queue
     * @param  {String}   queueName name of queue
     * @param  {Function} callback call when all task is done
     */
    execQueue: function(queueName, callback) {
        var self = this;
        var queue = self.getQueue(queueName);
        if (!queue) {
            callback('No Task named ' + queueName);
            return;
        }
        async.forEachSeries(queue, function(task, callback){
            self.pluginManager.exec(task.type, task.config, callback)
        }, callback);

    }
});

module.exports = ABC;