var PluginManager = require('./plugin-manager');
var async = require('async');
var _ = require('underscore');
var events = require('events');
var util = require('util');
var Utils = require('./utils/');
var Task = require('./task');
require('colors');

/**
 * ABC 任务系统
 * @param abcJSON
 * @return {ABC}
 * @constructor
 */
function ABC(abcJSON) {
    var self = this;

    if (!(self instanceof ABC)) {
        return new ABC(abcJSON)
    }

    self.utils = Utils;

    self.json = abcJSON;
    self._configs = abcJSON._configs ? _.clone(abcJSON._configs) : {};
    self._vars = abcJSON._vars ? _.clone(abcJSON._vars) : {};

    //解析任务
    self._initTasks(abcJSON);

    //初始化插件
    self.pluginManager = new PluginManager(self);

    if (abcJSON.plugins) {
        //添加自定义插件到插件系统的Map
        self.pluginManager.addMap(abcJSON.plugins);
    }

    //分析用到的插件
    var plugins = self._analyticsPlugin();

    //加载插件
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
     * 获取解析后的配置
     * @param type
     * @param name
     * @return {Object}
     */
    getConfig: function(type, name) {
        var self = this;
        var config = self._configs;

        if (config[type] && config[type][name]) {
            var taskConfig = config[type][name];
            return Utils.embedObject(taskConfig, self._vars);
        } else {
            return null;
        }
    },

    /**
     * 通过队列名，获取指定解析后的队列
     * @param {String} name 队列名称
     * @return {Array}
     */
    getQueue: function(name) {
        var self = this;
        return self._queues[name];
    },

    /**
     * 执行一个队列
     * @param  {String}   queueName name of queue
     * @param  {Function} callback call when all task is done
     */
    execQueue: function(queueName, callback) {
        var self = this;
        var queue = self.getQueue(queueName);

        var len = queue.length;
        var index = 0;

        console.log('::queue start(%s)', queueName.green);
        console.log();
        if (!queue) {
            callback('No Task named ' + queueName);
            return;
        }
        async.forEachSeries(queue, function(task, callback){
            index ++;
            console.log('<<<<< %s:%s (%d/%d)', task.type, task.name, index, len);
            self.pluginManager.exec(task, function(err, report){
                console.log('>>>>>\n');
                callback(err, report);
            });
        }, function(err, reports){
            if (err) {
                console.log('::Something is Wrong!'.red);
                console.err(err);
            }
            console.log('::done!'.green);
        });

    },

    /**
     * default Log
     * @param message
     */
    log: function(message) {
        console.log('[LOG] %s', message);
    },

    /**
     * Warning Log
     */
    warning: function(message) {
        console.log('[Warning] %s', message);
    },

    /**
     * exec the program with Error
     * @param message
     */
    fatal: function(message) {
        console.error(message);
        process.exit(1);
    },
    /**
     * pause the queue
     */
    pause: function() {

    },

    /**
     * resume the queue
     */
    resume: function() {

    },

    /**
     * 初始化任务
     * @param json {Object}
     * @param json.configs {Object}
     * @param json.plugins {Object}
     * @param json.tasks {Object}
     * @private
     */
    _initTasks: function(json) {
        var self = this;
        if (!json.tasks) {
            throw new Error('No task');
        }

        if (!_.keys(json.tasks)) {
            throw new Error('No task');
        }

        var tasks = json.tasks;
        var config = json._configs || {};
        /**
         * 解析后的任务队列
         * @type {Object}
         * @private
         */
        self._queues = _.chain(tasks)
            .pairs()
            .map(function (p) {
                //解析任务名
                p[1] = self._parseQueue(p[1]);
                return p;
            })
            .filter(function(p){
                // 过滤格式错误或没有对应配置项
                var task = p[1];
                return task;
            })
            .object()
            .value();
        return self;
    },

    /**
     * 处理队列，将配置分配给各任务
     * @param {Object} json
     * @private
     */
    _initConfigs: function (json) {
        //deliver configs
        var config = Utils.embedObject(json._configs || {}, json['var'] || {});
        var self = this;
        taskNames = _.keys(self._queues);

        _.each(taskNames, function(name) {

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
        return self;
    },


    /**
     * 解析队列
     * @param queue {Array} array of string
     * @return Array array of parse task
     * @private
     */
    _parseQueue: function(queue) {
        var self = this;
        return _.chain(queue)
            .map(function(task) {
                return self._parseTask(task);
            })
            .compact()
            .value();
    },
    /**
     * 解析任务
     * @param source
     * @return {Task}
     * @private
     */
    _parseTask: function(source) {
        var self = this;
        var sp = source.match(/^([^:]+):(.*)$/);
        var ret;

        if (sp) {
            return new Task({
                type: sp[1],
                name: sp[2],
                source: source
            }, self);
        } else {
            return null;
        }
    },

    /**
     * 分析队列中使用的插件
     * @return {Array} 插件的数组
     * @private
     */
    _analyticsPlugin: function() {
        var self = this;

        var plugins = _.chain(self._queues)
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
    }
});


module.exports = ABC;