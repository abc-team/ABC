// -*- coding: utf-8; -*-
var TreeStream = require('./treestream')
  , FilterList = require('./filter-list')
  , Matcher = require('./path-matcher')

var treestream = new TreeStream()
  , filterlist = new FilterList()
  , result = []
  , list

function isString(o){
  return toString.call(o) === '[object String]'
}

function find(root,wilds,done){
  if(isString(wilds)){
    filterlist.include(wilds)
  }else{
    wilds.forEach(function(wild){
      filterlist.include(wild)
    })
  }

  list = filterlist.getList()

  treestream.on('file',function(path,absPath){
    var b = Matcher.matches(list,path)
    if(b)
      result.push(path)
  })
  treestream.on('end',function(){
    done && done(result)
  })
  treestream.visit(root)
}

module.exports = find
