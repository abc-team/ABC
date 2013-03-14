// -*- coding: utf-8; -*-
var TreeStream = require('./treestream')
  , FilterList = require('./filter-list')
  , Matcher = require('./path-matcher')
  , util = require('./config-util')
  , Path = require('path')

function find(root,wilds,done){
  var treestream
    , filterlist = new FilterList()
    , list
    , result = []
    , cwd

  if(util.isAbsolutePath(root)){
    cwd = root
  }else{
    cwd = Path.resolve(process.cwd(),root)
  }

  if(util.isString(wilds)){
    filterlist.include(wilds)
  }else{
    wilds.forEach(function(wild){
      filterlist.include(wild)
    })
  }

  // list为绝对路径列表
  list = filterlist.getList(cwd)

  cwd = util.getProperPath(cwd)

  treestream = new TreeStream(list)

  treestream.on('file',function(path,absPath){
    var abs = absPath
    var b = Matcher.matches(list,abs)
    if(b)
      result.push(abs)
  })
  treestream.on('end',function(){
    done && done(result)
  })
  treestream.visit(cwd)
}

module.exports = find
