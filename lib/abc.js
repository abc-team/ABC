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

    addConfig: function(config) {

    },

    initInternalPlugins: function() {

    },

    addPlugin: function() {

    },

    execQueue: function(taskName, callback) {

    },

    getQueue: function(callback) {

    },

    addQueue: function(name, queue){

    }
});

module.exports = ABC;