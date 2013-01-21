var _ = require('underscore');

function Task(type) {
    self.type = type;
}

_.extend(Task.prototype, {
    exec: function (callback) {

    },

    addSubTask: function () {

    }
});