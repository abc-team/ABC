var _ = require('underscore');
var Mustache = require('mustache');

/**
 * compile Object Config
 * @param config {Object|Array}
 * @return {Object|Array}
 */
function compile(config) {
    var ret;
    debugger;
    if (!(_.isObject(config))) {
        return config;
    }

    var cache = arguments[1];

    if (!cache) {
        cache = [];
    }

    if (cache.indexOf(config) === -1) {
        cache.push(config);
    } else {
        return null;
    }


    if (_.isArray(config)) {
        ret = _.chain(config)
            .map(function(value){
                if(_.isString(value)) {
                    value = Mustache.compile(value);
                } else if(_.isObject(value)) {
                    value = compile(value, cache);
                }

                return value;
            })
            .value();
    } else {
        ret = _.chain(config)
            .pairs(config)
            .map(function(pair){
                var key = pair[0];
                var value = pair[1];

                if (key === 'src' || key === 'dest' || key === 'exclude') {
                    return pair;
                }

                if(_.isString(value)) {
                    value = Mustache.compile(value);
                } else if(_.isObject(value)) {
                    value = compile(value, cache);
                }

                return [pair[0], value];
            })
            .object()
            .value();
    }

    return ret;

}

/**
 * render a compiled Config
 * @param compiledConfig
 * @param data
 * @return {*}
 */
function render (compiledConfig, data) {
    var ret;

    if (!(_.isObject(compiledConfig))) {
        return compiledConfig;
    }

    var cache = arguments[2];

    if (!cache) {
        cache = [];
    }

    if (cache.indexOf(compiledConfig) === -1) {
        cache.push(compiledConfig);
    } else {
        return null;
    }


    if (_.isArray(compiledConfig)) {
        ret = _.chain(compiledConfig)
            .map(function(value){
                if(_.isFunction(value)) {
                    value = value(data);
                } else if(_.isObject(value)) {
                    value = render(value, data, cache);
                }

                return value;
            })
            .value();
    } else {
        ret = _.chain(compiledConfig)
            .pairs(compiledConfig)
            .map(function(pair){
                var key = pair[0];
                var value = pair[1];

                if (key === 'src' || key === 'dest' || key === 'exclude') {
                    return pair;
                }

                if(_.isFunction(value)) {
                    value = value(data);
                } else if(_.isObject(value)) {
                    value = render(value, data, cache);
                }

                return [pair[0], value];
            })
            .object()
            .value();
    }

    return ret;
}

exports.compile = compile;
exports.render = render;