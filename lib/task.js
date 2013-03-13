var _ = require('underscore');
var util = require('util');
/**
 * »ŒŒÒ¿‡
 * @param {Object} obj
 * @param {ABC} abc
 * @constructor
 */

function Task(obj, abc) {
    var self = this;
    if(!obj.type) {
        throw new Error('[new Task] no task.type');
    }
    self.abc = abc;
    self.type = obj.type;
    self.name = obj.name;
    self.source = obj.source;
}

_.extend(Task.prototype, {
    /**
     * getParsedConfig
     */
    config: function() {
        var self = this;
        return self.abc.getConfig(self.type, self.name);
    },

    /**
     * 
     */
    files: function() {

    },

    log: function (message) {
        var self = this;
        message = util.format.apply(self, arguments);
        self.abc.log(util.format('(%s:%s) %s',self.type, self.name, message));
    }

});

module.exports = Task;