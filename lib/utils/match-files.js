// -*- coding: utf-8; -*-
var util = require('./config-util')
  , find = require('./find')

function matchFiles(pattern_arr,done){
  var initPath = util.getBeginPath(pattern_arr)
  find(initPath,pattern_arr,done)
}


