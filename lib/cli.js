var ABC = require('./abc');

module.exports = function (argv) {
    console.log('argv: ', argv || progress.argv);
    console.log(' cwd: ', process.cwd());
    var config = {};
    var abc = new ABC(config);
};