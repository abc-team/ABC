var _ = require('underscore');
var Mustache = require('mustache');

/**
 * embed object string with mustache
 * @param target {Object|Array}
 * @param vars
 * @return {Object|Array}
 */
function embedObject(target, vars) {
    var ret;

    if (!(_.isObject(target))) {
        return target;
    }

    var cache = arguments[2];

    if (!cache) {
        cache = [];
    }

    if (cache.indexOf(target) === -1) {
        cache.push(target);
    } else {
        return null;
    }


    if (_.isArray(target)) {
        ret = _.chain(target)
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
        ret = _.chain(target)
            .pairs(target)
            .map(function(pair){
                var key = pair[0];
                var value = pair[1];

                if (key === 'src' || key === 'dest' || key === 'exclude') {
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