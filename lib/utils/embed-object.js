var _ = require('underscore');
var Mustache = require('mustache');

/**
 * embed object string with mustache
 * @param configs {Object|Array}
 * @param vars
 * @param cache
 * @return {Object|Array}
 */
function embedObject(configs, vars, cache) {
    var ret;

    if (!(_.isObject(configs))) {
        return null;
    }

    if (!cache) {
        cache = [];
    }

    if (cache.indexOf(configs) === -1) {
        cache.push(configs);
    } else {
        return null;
    }


    if (_.isArray(configs)) {
        ret = _.chain(configs)
            .map(function(value){
                if(_.isString(value)) {
                    value = Mustache.render(value, vars);
                } else if(_.isObject(value)) {
                    value = embedObject(value, vars, cache);
                }
                return value;
            })
            .value();
    } else {
        ret = _.chain(configs)
            .pairs(configs)
            .map(function(pair){
                var value = pair[1];
                if (_.has(['src', 'dest'], pair[1])) {
                    return pair;
                }

                if(_.isString(value)) {
                    value = Mustache.render(value, vars);
                } else if(_.isObject(value)) {
                    value = embedObject(value, vars, cache);
                }
                return [pair[0], value];
            })
            .object()
            .value();
    }

    return ret;

}
module.exports = embedObject;