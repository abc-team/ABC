// -*- coding: utf-8; -*-
var extractor = require('../../lib/utils/filename-extractor')

extractor('.','*.js','',function(files){
  console.log(files)
})