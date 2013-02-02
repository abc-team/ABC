var _ = require('underscore');
var fs = require('fs');

function PluginManager(abc) {
    var self = this;
    self.abc = abc || {};
    self._plugins = {};
}

_.extend(PluginManager.prototype, {

    /**
     * add plugin
     * @param name {String} of plugin to add
     * @param plugin {String|Function} location of plugin to add
     * @param initConfig {Object} Config for init the plugin
     */
    add: function (name, plugin, initConfig) {
        var self = this;
        var fn;

        if (!plugin) {
            throw new Error('plugin location is required');
        }

        if (_.isString(plugin)) {
            try {
                var fnPlugin = require(plugin);
            } catch (e) {
                throw e;
            }

            if (!_.isFunction(fnPlugin)) {
                throw new Error('plugin "' + name + '" error! the exports of plugin must be a function');
            }
            self._add(name, fnPlugin, initConfig);
        } else if(_.isFunction(plugin)) {
            self._add(name, plugin, initConfig);
        } else {
            throw new Error('Failed to load Plugin "' + name + '"');
        }


    },

    _add: function(name, fnPlugin, initConfig) {
        var self = this;

        try {
            self._plugins[name] = fnPlugin(self.abc, initConfig);
        } catch (e) {
            throw e;
        }
    },

    /**
     * Exec a plugin with config
     * @param name {String} name of plugin
     * @param runtime {Object} runtime Object
     * @param callback {Function}
     */
    exec: function (name, runtime, callback) {
        var self = this;

        if (!_.has(self._plugins, name)) {
            callback(new Error('plugin not exists'));
            return;
        }

        //TODO: 超时检查
        self._plugins[name](runtime, callback);
    },

    /**
     * load all required plugins
     */
    loadNPMPlugin: function (name) {

    }
});

exports.PluginManager = PluginManager;