var ABC = require('./abc');
var optimist = require('optimist');


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
    console.log(argv);

    var command = argv[2];

    // current work path
    var cwd = process.cwd();

    switch(command) {
        case 'init':
            argv = optimist
                .alias('n', 'name')
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
        case 'build':
            argv = optimist
                .alias('t', 'task')
                .describe('n', 'Name of your task!')
                .alias('f', 'file')
                .describe('f', 'Config file')
                .usage('Init a abc task in current directory.\nUsage: $0')
                .parse(argv);
            var target = argv[3] || 'default';
            var matches = target.match(/^([^.]+)(\.(.+))?$/);
            var name = matchs[1] || '';
            var task = matchs[3] || 'default';
            var abcFile = !name ? 'abc.json' : 'abc.' + name + '.json';

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


                });
            });



            break;
        default:


    }

    var config = {};

};