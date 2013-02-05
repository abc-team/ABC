var _ = require('underscore');
var mustache = require('mustache');
/**
 * embed object string with mustache
 * @param configs {Object|Array}
 * @param vars
 * @return {*}
 */
function embedObject(configs, vars) {
    var ret;
    if (_.isArray(configs)) {
        ret = _.chain(configs)
            .map(function(value){
                if(_.isString(value)) {
                    value = mustache.render(value, vars);
                } else if(_.isArray(value) || _.isObject(value)) {
                    value = embedObject(value, vars);
                }
                return value;
            })
            .value();
    } else {


        ret = _.chain(configs)
            .pairs(configs)
            .map(function(pair){
                var value = pair[1];

                if(_.isString(value)) {
                    value = mustache.render(value, vars);
                } else if(_.isArray(value) || _.isObject(value)) {
                    value = embedObject(value, vars);
                }
                return [pair[0], value];
            })
            .object()
            .value();
    }

    return ret;

}
module.exports = embedObject;