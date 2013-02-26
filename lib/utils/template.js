var Mustache = require('mustache');
module.exports = function(tpl, obj) {
    return Mustache.render(tpl, obj);
};