var _ = require('underscore');
var utils = {};

module.exports = utils;
_.extend(utils, {
        file: require('./file'),
        template: require('./template'),
        embedObject: require('./embed-object')
});