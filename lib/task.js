var _ = require('underscore');

function Task(type) {
    var self = this;
    self.type = type;
}

_.extend(Task.prototype, {
    exec: function (callback) {

    },

    addSubTask: function () {

    }
});
module.exports = Task;