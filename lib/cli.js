var ABC = require('./abc');
var optimist = require('optimist');
var fs = require('fs');
var path = require('path');

/**
 * 命令的统一回调函数
 * @param err
 */
function commandCallback(err) {
    //处理全局错误
    if(err) {
        console.log(err);
        process.exit(1);
        return;
    }
    console.log('success');
    process.exit(0);
}


module.exports = function (argv) {
    argv = argv || process.argv;

    // 子命令
    var command = argv[2];

    // current work path
    var cwd = process.cwd();

    switch(command) {
        case 'init':
            argv = optimist
                .alias('n', 'file')
                .describe('n', 'Name of your task!')
                .alias('p', 'path')
                .describe('p', 'Path to init!')
                .usage('Init a abc task in current directory.\nUsage: $0')
                .parse(argv);

            ABC.init({
                path: argv.path || cwd,
                name: argv.name
            }, commandCallback);

            break;
        case 'run':
            argv = optimist
                .describe('f', 'Config file')
                .alias('f', 'file')
                .usage('Run a task.\nUsage: $0')
                .parse(argv);

            var task = argv._[3] || 'default';
            var abcFile = path.resolve(argv.file || './abc.json');

            var abcConfig = require(abcFile);
            // 记录配置文件位置，用于find时的相对路径上下文
            abcConfig.__filename = abcFile
            var abc = new ABC(abcConfig);
            abc.execQueue(task, commandCallback);

            break;
        default:
            //TODO
    }

    var config = {};

};