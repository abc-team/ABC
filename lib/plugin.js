var _ = require('underscore');

function PluginManager() {
    self._plugins = {};
}

_.extend(PluginManager.prototype, {

    /**
     * add plugin
     * @param name {String} of plugin to add
     * @param location {String} location of plugin to add
     */
    add: function (name, location) {
        var self = this;
        self._plugins[name] = fn(self);
    },

    /**
     * Exec a plugin with config
     * @param name
     * @param runtime
     * @param callback
     */
    exec: function (name, runtime, callback) {
        self._plugins[name] && self._plugins[name]
    },

    /**
     * load all required plugins
     */
    loadNPMPlugin: function (name) {

    }
});

module.exports.PluginManager = PluginManager;