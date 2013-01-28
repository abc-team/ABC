var Task = require('./task');
var PluginCenter = require('./plugin');
var _ = require('underscore');

function ABC(config) {
    var self = this;
    self.task = new Task();
    self.utils = require('utils/');
    self._queues = {};
    self._plugins = {};
}

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
     * @param  {String}   taskName name of task
     * @param  {Function} callback call when all task is done
     */
    execQueue: function(taskName, callback) {

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