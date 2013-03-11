var path = require('path');
var async = require('async');
var fs = require('fs');
var iconv = require('iconv-lite');
var util = require('util');
var _ = require('underscore');

exports.findInDir = findInDir;

/**
 * Find files in dir, match the given regex
 * @param dir {String} directory to find
 * @param {Regex} reg regex to match
 * @param callback call with error or null and an array of files
 */
function findInDir(dir, reg, callback) {

    if (!callback && typeof reg === 'function') {
        callback = reg;
        reg = null;
    }

    dir = path.resolve(dir);

    function listDir(dir, from, callback) {

        fs.readdir(dir, function(err, list){
            if (err) {
                callback(err);
                return;
            }

            list = list.filter(function (file) {
                return !(/^\./.test(file));
            });

            async.map(list, function(p, callback){
                var abs = path.join(dir, p);
                var p2 = path.join(from, p);

                fs.stat(abs, function(err, stat){
                    if (err) {
                        callback(err);
                        return;
                    }
                    if (stat.isDirectory()) {
                        listDir(abs, p2, callback);
                    } else {
                        callback(null, p2);
                    }
                })
            }, callback);
        });
    }

    fs.exists(dir, function (exist) {
        if(!exist) {
            callback(new Error('findInDir: path ' + dir + ' not exist;'));
            return;
        }

        listDir(dir, '', function(err, list) {
            if (err) {
                callback(err);
                return;
            }
            var result = _.chain(list)
                .flatten()
                .filter(function(p){
                    if(reg instanceof RegExp) {
                        return reg.test(p);
                    }
                    return true;
                })
                .value();

            callback(null, result);
        });
    });


};

/**
 * 创建目录， 创建父目录如果不存在
 * @param  {string}   p        path of dir to create
 * * @param  {string}   mode        path of dir to create
 * @param  {Function} callback call with (error)
 */
var mkdirp = exports.mkdirp = require('mkdirp');

/**
 * copy the entire directory
 * @param  {String} src_path    path of the directory copy from
 * @param  {String} target_path path of the directory to copy to
 * @param  {Object} config      config of copy
 * @return {[type]}             [description]
 */
var copyDirSync = exports.copyDirSync = function (src_path, target_path, config) {

    src_path = path.resolve(src_path);
    target_path = path.resolve(target_path);

    config = config || {};

    if (src_path === target_path) {
        throw new Error('copyDirSync: src_path is target_path!')
    }

    if (!fs.existsSync(src_path)) {
        throw new Error('copyDirSync: path not exist;');
    }

    if (!fs.existsSync(target_path)) {
        fs.mkdirSync(target_path);
    }


    fs.readdirSync(src_path).forEach(function (p){
        var skip = false;
        if (config.excludes) {
            config.excludes.forEach(function (reg) {
                if (reg instanceof RegExp) {
                    if (!skip && reg.test(p)) {
                        skip = true;
                    }
                } else if (reg instanceof String) {
                    if (!skip && reg.test(p)) {
                        skip = true;
                    }
                }
            });
        }

        if (skip) {
            return;
        }

        var src = path.resolve(src_path, p),
            dst = path.resolve(target_path, p),
            stat = fs.statSync(src);
        if (stat.isDirectory(src)) {
            copyDirSync(src, dst);
        } else {
            fs.writeFileSync(dst, fs.readFileSync(src));
        }
    });
};

var rmTreeSync = exports.rmTreeSync = function(p){
    if (!fs.existsSync(p)) {
        return;
    }

    var files = fs.readdirSync(p);

    files.forEach(function(file) {
        var full_p = path.join(p, file);
        if (fs.statSync(full_p).isDirectory()) {
            rmTreeSync(full_p);
            return;
        }
        fs.unlinkSync(full_p);
    });

    fs.rmdirSync(p);
};

var rmTree = exports.rmTree = function(dir, callback) {
    fs.stat(dir, function(err, stat) {

        if (err) {
            // no file exist
            console.log('rmTree no file found!');
            callback(null);
            return;
        }

        if(!stat.isDirectory()) {
            var error = new Error('not a directory!');
            error.name = 'rmTree';
            return callback(error);
        }

        fs.readdir(dir, function(err, filenames) {

            if (err) {
                callback(err);
                return;
            }

            async.forEach(filenames, function(p, callback) {
                var ap = path.join(dir, p);
                fs.stat(ap, function (err, stat) {
                    if (err) {
                        callback(null);
                        return;
                    }

                    if (stat.isFile()) {
                        fs.unlink(ap, callback);
                        return;
                    }

                    if (stat.isDirectory()){
                        rmTree(ap, callback);
                        return;
                    }

                    callback(null);

                });
            }, function (err) {
                if (err) {
                    callback(err);
                    return;
                }
                fs.rmdir(dir, callback);
            });
        });
    });
};


/**
 * write JSON to a file with pretty print
 * @param  {String} filename file to write
 * @param  {Object} obj      the Javascript Object
 */
var writeJSONSync = exports.writeJSONSync = function(filename, obj){
    var jsonText = JSON.stringify(obj, null, 4);
    fs.writeFileSync(path.resolve(filename), jsonText);
};

/**
 * write JSON to a file with pretty print
 * @param  {String} filename file to write
 * @param  {Object} obj      the Javascript Object
 */
var writeJSON = exports.writeJSON = function(filename, obj, callback){
    filename = path.resolve(filename);
    var dirname = path.dirname(filename);

    if (typeof obj != 'object') {
        return callback(new Error('writeJSON: no object'))
    }

    var jsonText = JSON.stringify(obj, null, 4);

    fs.exists(dirname, function (exist) {
        if (!exist) {
            return callback(new Error('writeJSON: path %s not exist', dirname));
        }
        fs.writeFile(filename, jsonText, 'utf8', callback);
    });
};

/**
 * read json from file
 * @param  {String} jsonpath path of json file
 * @return {Object}          object of json file
 */
var readJSON = exports.readJSON = function(jsonpath, callback){
    jsonpath = path.resolve(jsonpath);
    fs.readFile(jsonpath, 'utf8', function (err, text) {
        if (err) {
            return callback(err);
        }
        var json;
        try {
            json = JSON.parse(text);
        } catch (e) {
            callback(e);
            return;
        }
        callback(null, json)
    });
};
/**
 * read json from file
 * @param  {String} jsonpath path of json file
 * @return {Object}          object of json file
 */
var readJSONSync = exports.readJSONSync = function(jsonpath){
    try {
        var jsonText = fs.readFileSync(path.resolve(jsonpath), 'utf-8');
        var json = JSON.parse(jsonText);
    } catch (e) {
        throw e;
    }
    return json;
};

var iconvDir = exports.iconvDir =  function(src_path, from_charset, target_path, to_charset){
    src_path = path.resolve(src_path);
    target_path = path.resolve(target_path);


    from_charset = from_charset || 'utf8';
    to_charset = to_charset || 'utf8';

    if (src_path === target_path) {
        throw new Error('iconvDir: src_path is target_path!')
    }

    if (!fs.existsSync(src_path)) {
        throw new Error('iconvDir: path ' + src_path+ ' not exist;');
    }

    if (!fs.existsSync(target_path)) {
        fs.mkdirSync(target_path);
    }


    fs.readdirSync(src_path).forEach(function(p){
        var src = path.resolve(src_path, p),
            dst = path.resolve(target_path, p),
            stat = fs.statSync(src),
            srt;


        if (stat.isDirectory(src)) {
            iconvDir(src, from_charset,  dst, to_charset);
        } else {
            var buf = fs.readFileSync(src);

            if (from_charset != to_charset) {
                srt = iconv.decode(buf, from_charset);
                buf = iconv.encode(srt, to_charset);
            }

            fs.writeFileSync(dst, buf);
        }
    });
};

/**
 * convert directory charset
 * @param  {Object}   config   configs of convert
 * @param  {Function} callback will be call with callback(err)
 */
exports.iconv = function(config, callback) {
    var src_path = path.resolve(config.from.path);
    var to_path = path.resolve(config.to.path);
    var from_charset = config.from.charset;
    var to_charset = config.to.charset;
    var reg = config.from.test || null;
    var excludes = config.from.excludes;


    if (!src_path || !to_path || !from_charset || !to_charset) {
        console.log("form %s@%s\nto: %s@%s\n", src_path, from_charset, to_path, to_charset);
        return callback(new Error('iconv not enough params'));
    }

    findInDir(src_path, reg, function (err, paths) {
        if(err) {
            callback(err);
            return;
        }

        paths = paths.filter(function (p) {
            if (excludes) {
                for (var i = 0; i < excludes.length; i++ ) {
                    var reg = excludes[i];
                    if (reg.test && reg.test(p)) {
                        return false;
                    }
                    if (typeof reg === 'string' && reg === path.filename(p) ) {
                        return false;
                    }
                }
            }
            return true;
        });

        if(paths.length === 0) {
            callback(null);
            return;
        }

        async.forEach(paths, function (filepath, callback) {
            filepath = path.resolve(src_path, filepath);
            var srt;
            var rel = path.relative(src_path, filepath);
            var target = path.resolve(to_path, rel);
            fs.readFile(filepath, function(err, buf) {
                if (err) {

                    if (err.code === 'ENOENT') {
                        callback(null);
                        return;
                    }

                    callback(err);
                    return;
                }

                if (from_charset != to_charset) {
                    srt = iconv.decode(buf, from_charset);
                    buf = iconv.encode(srt, to_charset);
                }

                mkdirp(path.dirname(target), function(err) {
                    if(err) {
                        callback(err);
                        return;
                    }
                    fs.writeFile(target, buf, callback);
                });

            });



        }, callback);
    });
};

exports.getUserHome = function() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
};

var cloneDir = exports.cloneDir = function (src, dest, callback) {
    fs.readdir(src, function (err, files) {
        if (err) {
            callback(err);
            return;
        }

        mkdirp(dest, function (err) {
            if (err) {
                callback(err);
                return
            }


            files = files.filter(function (filename) {
                return !(filename === '.svn' || filename == '.git');
            });

            if (!files.length) {
                callback(null);
                return;
            }

            async.forEach(files, function (item, callback) {
                var srcfilename = path.resolve(src, item);
                var destfilename = path.resolve(dest, item);
                var rs = fs.createReadStream(srcfilename);
                var ws = fs.createWriteStream(destfilename);
                rs.once('end', callback);
                rs.pipe(ws);
            });
        });

    });
}