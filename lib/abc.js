var plugin = require('./plugin');
var _ = require('underscore');
var events = require('events');
var util = require('util');
var utils = require('./utils/');


function ABC(config) {
    var self = this;

    if (!(self instanceof ABC)) {
        return new ABC(config)
    }

    self.utils = utils;
    self._queues = {};
    self.pluginManager = new plugin.PluginManager(self);
    self._config = self.initJSON(config);
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
        console.log('ABC.init', config);
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
    initJSON: function(json) {
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
        var config = utils.embedObject(json.config || {}, json.var || {});

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

                if (!_.has(config, task.type) || _.has(config[task.type], task.name)) {
                    var msg = util.format('No config found %s:%s in task %s', task.type, task.name, name);
                    throw new Error(msg);
                }

                task.config = _.clone(config[task.type][task.name]);
                return task;
            });
        });

        //parse plugin
        self._plugins = {};

        if (json.plugins) {
            var pluginNames = _.keys(json.plugins);

            _.each(pluginNames, function(name){

            });
        }
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
                        name: sp[2]
                    };
                } else {
                    ret = null;
                }

                return ret;
            })
            .compact()
            .value();
    },



    initPlugins: function() {

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

    },
    /**
     * add Queue to abc
     * @param {String} name  name of Queue
     * @param {Array}  queue array of tasks
     */
    addQueue: function(name, queue){

    }
});

module.exports = ABC;