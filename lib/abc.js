var Task = require('./task');
var PluginCenter = require('./plugin');

var defaultConfig = function () {

}

function abc() {
    var self = this;
    self.Plugin = new PluginCenter();
    self.task = new Task();
}

module.exports = abc;