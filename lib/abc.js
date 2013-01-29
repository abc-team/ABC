var Task = require('./task');
var PluginCenter = require('./plugin');
var _ = require('underscore');

function ABC(config) {
    var self = this;
    self.task = new Task();
    self.utils = require('./utils/index');
    self._queues = {};
    self._plugins = {};
}

_.extend(ABC, {

    /**
     * init a abc.json file
     * @param config
     * @param callback
     */
    init: function(config, callback){
        console.log('init', config);
        callback(null);
    }
});

_.extend(ABC.prototype, {
    /**
     * add Config to abc
     * @param config {Object}
     */
    addConfig: function(config) {

    },

    /**
     * load plugins provide by abc
     */
    initInternalPlugins: function() {

    },
    
    /**
     * add a plugin to abc
     * @param {String}   name name of Plguin
     * @param {Function} fn   plugin function
     */
    addPlugin: function(name, fn) {
        var self = this;
        self._plugins[name] = fn(self);
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