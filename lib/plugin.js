var _ = require('underscore');
var fs = require('fs');

/**
 * Plugin Manager, add and exec plugins
 * @param abc {Object} abc instance
 * @constructor
 */
function PluginManager(abc) {
    var self = this;
    self.abc = abc || {};
    self._plugins = {};
    self._map = {};
}

_.extend(PluginManager, {
    defaultPlugins: {
        'log': './plugins/log/index'
    }
});

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

    /**
     * add the plugin function
     * @param name {String}
     * @param fnPlugin {Function}
     * @param initConfig {Object}
     * @private
     */

    _add: function(name, fnPlugin, initConfig) {
        var self = this;
        console.log('plugin.add %s ', name);

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

        //TODO: 加上超时处理
        self._plugins[name](runtime, callback);
    },

    /**
     * load all required plugins
     */
    loadPlugins: function (plugins) {
        var self = this;
        plugins.forEach(function(name) {
            var pluginPath = self.resolve(name);
            console.log(name, pluginPath)
            self.add(name, pluginPath)
        });
    },

    resolve: function(pluginName) {
        var self = this;
        return PluginManager.defaultPlugins[pluginName] || self._map[pluginName]
    },
    /**
     * 添加自定义的插件配置
     * @param pluginMap {Object}
     */
    addMap: function (pluginMap) {
        if (!pluginMap) {
            return;
        }
        var self = this;
        _.extend(self._map, pluginMap);
    }
});

exports.PluginManager = PluginManager;