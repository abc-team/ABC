// -*- coding: utf-8; -*-
var TreeStream = require('../../lib/utils/treestream')
  , FilterList = require('../../lib/utils/filter-list')
  , Matcher = require('../../lib/utils/path-matcher')

var treestream = new TreeStream()
  , filterlist = new FilterList()
  , result = []
  , list

filterlist.include('*.js')

list = filterlist.getList()

// console.log(list)

treestream.visit('.')

treestream.on('file',function(path,absPath){
  console.log(path)
  var b = Matcher.matches(list,path)
  console.log(b)
  if(b)
    result.push(path)
})

// treestream.on('folder',function(){console.log(arguments)})

treestream.on('end',function(){
  console.log('---------result---------')
  console.log(result)
  console.log('---------result---------')
})
