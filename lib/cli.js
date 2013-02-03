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
    argv = argv || progress.argv;

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
        case 'exec':
        case 'run':
            argv = optimist
                .describe('f', 'Config file')
                .alias('f', 'file')
                .usage('Run a task.\nUsage: $0')
                .parse(argv);

            var task = argv._[3] || 'default';
            var file = argv.file;

            var queueName = argv.task;
            var abcFile = !file ? 'abc.json' : 'abc.' + file + '.json';

            fs.exists(abcFile, function (exist) {
                if (!exist) {
                    commandCallback(new Error('abc.json not exists!'));
                    return;
                }

                fs.readFile(abcFile, 'utf-8', function (err, content) {
                    if (err) {
                        commandCallback(err);
                        return;
                    }

                    try {
                        var abcConfig = JSON.parse(content);
                    } catch(e) {
                        console.log("Error parsing JSON file:%s", abcFile);
                    }

                    var abc = new ABC(abcConfig);
                    abc.execQueue(queueName, commandCallback);
                });
            });



            break;
        default:
            //TODO
    }

    var config = {};

};