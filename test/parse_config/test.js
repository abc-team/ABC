// -*- coding: utf-8; -*-
// debugger;

// console.log(Matcher.match('/var/www/f/**/abcenter/ABC/lib/utils/*.js','/var/www/f/dropbox/gits/abcenter/ABC/lib/utils/a.js'))
// console.log(Matcher.match('/var/www/f/*/*.js','/var/www/f/b/a.js'))

// console.log(Matcher.matches([ '/var/www/f/dropbox/gits/abcenter/ABC/test/a.js', '/var/www/f/dropbox/gits/abcenter/ABC/test/b.js'], "/var/www/f/dropbox/gits/abcenter/ABC/test/parse_config/src/c.js"
// ))
// var Matcher = require('../../lib/utils/path-matcher')

// debugger;

console.log(Matcher.matches([ '/var/www/f/dropbox/gits/abcenter/ABC/test/parse_config/**/a.js','/var/www/f/dropbox/gits/abcenter/ABC/test/parse_config/**/b.js' ],'/var/www/f/dropbox/gits/abcenter/ABC/test/parse_config/src/a.js'))