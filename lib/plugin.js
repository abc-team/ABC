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

    },
    /**
     * Exec a plugin with config
     * @param name
     * @param config
     * @param callback
     */
    exec: function (name, config, callback) {

    }
});