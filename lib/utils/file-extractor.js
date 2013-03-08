// -*- coding: utf-8; -*-
var find = require('./find')
  , FilterList = require('./filter-list')
  , util = require('./config-util')
  , Path = require('path')

// a light wrap of `find`
function extractor(taskCfg,abcConfig,done){
  var filterlist = new FilterList()
    , include = taskCfg.include
    , exclude = taskCfg.exclude
    , list
    , files
    , root = Path.dirname(abcConfig.__filename)  // abc.json 配置文件所在目录

  if(!include && !exclude){
    return
  }

  include && filterlist.include(include)
  exclude && filterlist.exclude(exclude)
  list = filterlist.getList()

  find(root,list,function(list){
    var ret = new Files(list,taskCfg)
    done && done(ret)
  })
}

function Files(pathList,taskConfig){
  this.files = pathList
  this.dest = taskConfig
  this._config = taskConfig
}
// 还需要在Files上包装什么方法？
