var abc = require('./abc');

module.exports = function (argv) {
    console.log('argv: ', argv || progress.argv);
    console.log(' cwd: ', process.cwd());
};