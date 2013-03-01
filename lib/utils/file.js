var fs = require('fs');
/**
 * read json from file
 * @param  {String} jsonpath path of json file
 * @return {Object}          object of json file
 */
var readJSON = exports.readJSON = function(jsonpath, callback){
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