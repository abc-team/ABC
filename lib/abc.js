var plugin = require('./plugin');
var async = require('async');
var _ = require('underscore');
var events = require('events');
var util = require('util');
var utils = require('./utils/');

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

    self.utils = utils;
    self.json = abcJSON;

    //解析任务
    self.initTasks(abcJSON);

    //初始化插件
    self.pluginManager = new plugin.PluginManager(self);

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
     * 初始化任务
     * @param json {Object}
     * @param json.config {Object}
     * @param json.plugins {Object}
     * @param json.tasks {Object}
     */
    initTasks: function(json) {
        var self = this;
        if (!json.tasks) {
            throw new Error('No task');
        }

        if (!_.keys(json.tasks)) {
            throw new Error('No task');
        }

        var tasks = json.tasks;
        var config = json.config || {};

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
                return task && task.check();
            })
            .object()
            .value()
    },

    /**
     * 处理队列，将配置分配给各任务
     * @param {Object} json
     */
    initConfigs: function (json) {
        //deliver configs
        var config = utils.embedObject(json.config || {}, json['var'] || {});
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
    },

    /**
     * 获取解析后的配置
     * @param type
     * @param name
     * @return {*}
     */
    getConfig: function(type, name) {
        var self = this;
        var config = self.json.config;
        if (config[type] && config[type][name]) {
            var taskConfig = config[type][name];
            return utils.embedObject(taskConfig, self.json.vars);
        } else {
            return null;
        }
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

    _parseTask: function(source) {
        var sp = source.match(/^([^:]+):(.*)$/);
        var ret;

        if (sp) {
            ret = new Task({
                type: sp[1],
                name: sp[2],
                source: source
            }, self);
        } else {
            ret = null;
        }

        return ret;
    },

    /**
     * 通过队列名，获取指定解析后的队列
     * @param name {String}
     * @return {*}
     */
    getQueue: function(name) {
        var self = this;
        return self._queues[name];
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
    },

    /**
     * 执行一个队列
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
            self.pluginManager.exec(task, callback)
        }, callback);

    }
});

/**
 * 任务类
 * @param {Object} obj
 * @param {ABC} abc
 * @constructor
 */
function Task(obj, abc) {
    var self = this;
    self.abc = abc;
    if(!obj.type) {
        throw new Error('no task.type')
    }
    self.type = obj.type;
    self.name = obj.name;
    self.source = obj.source;
}

_.extend(Task.prototype, {
    /**
     * getParsedConfig
     */
    getConfig: function() {
        var self = this;
        self.abc.getConfig(self.type, self.name);
    },

    /**
     * 解析src and dest 参数 生成文件列表
     */
    files: function() {

    },

    /**
     * 检查任务格式是否正确
     */
    check: function(){

    }

});

module.exports = ABC;