var plugin = require('./plugin');
var _ = require('underscore');
var events = events.EventEmitter;

function ABC(config) {
    var self = this;

    if (!(self instanceof ABC)) {
        return new ABC(config)
    }

    self.utils = require('./utils/index');
    self._plugins = {};
    self._queues = {};
    self.pluginManager = new plugin.PluginManager(self);
    self.parseConfig();
    self.initPlugins();
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
     * add Config to abc
     * @param config {Object}
     */
    parseConfig: function(config) {

    },

    initPlugins: function() {

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