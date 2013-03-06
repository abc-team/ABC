var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var util = require('util');

var Task = require('./task');

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
        'log': path.join(__dirname, './plugins/log/index')
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
        var fnPlugin;

        if (!plugin) {
            throw new Error(util.format('plugin "%s" location is required', name));
        }

        if (_.isString(plugin)) {
            // 相对路径转为绝对路径
            // 因为require 引用的是相对当前执行脚本的文件，不是 PWD。
            if (/^\.?\/]/.test(plugin)) {
                plugin = path.resolve(plugin);
            }

            fnPlugin = require(plugin);


            if (fnPlugin.abcPlugin) {
                // 给现有模块，添加 abc的功能， 可以添加到 exports.abcPlugin
                if(_.isFunction(fnPlugin.abcPlugin)) {
                    fnPlugin = fnPlugin.abcPlugin;
                }
            }

            if (!fnPlugin || !_.isFunction(fnPlugin)) {
                var msg = util.format('Can\'t load plugin [%s:%s]', name, plugin);
                throw (new Error(msg));
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
        var fn = fnPlugin(self.abc, initConfig);

        if (!fn || !_.isFunction(fn)) {
            throw new Error('Can\'t init plugin, the return of plugin function must be a function!' );
        }

        self._plugins[name] = fn;
    },

    /**
     * Exec a plugin with config
     * @param task {Task} runtime Object
     * @param callback {Function}
     */
    exec: function (task, callback) {
        var self = this;

        if (!_.has(self._plugins, task.type)) {
            callback && callback(new Error('plugin not exists'));
            return;
        }

        console.log('<<<<< %s:%s', task.type, task.name)
        self._plugins[task.type](task, function(err, report){
            console.log('>>>>>\n');
            callback(err, report);
        });
    },

    /**
     * load all required plugins
     * @param {Array} plugins plugins to load
     */
    loadPlugins: function (plugins) {
        var self = this;
        plugins.forEach(function(name) {
            var pluginPath = self.resolve(name);
            self.add(name, pluginPath)
        });
    },

    /**
     * 获取插件路径
     * @param pluginName
     * @return {*}
     */
    resolve: function(pluginName) {
        var self = this;
        return PluginManager.defaultPlugins[pluginName] || self._map[pluginName];
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

module.exports = PluginManager;