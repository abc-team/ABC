// -*- coding: utf-8; -*-
var util = require('../lib/utils/config-util')
  , Path = require('path')
  , MatchFiles = require('../lib/utils/match-files')

// require('should');

var stream = MatchFiles('.','parse_*/*.js','parse_config/parse_config.cfg.js')

stream.on('file',function(absPath,filename,extname,$){
  console.log($)
})


