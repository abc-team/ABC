// -*- coding: utf-8; -*-
var util = require('util')
  , configUtil = require('./config-util')
  , FilterList = require('./filter-list')
  , Matcher = require('./path-matcher')
  , Path = require('path')
  , Emitter = require('events').EventEmitter
  , TreeStream = require('./treestream')

function MatchFiles(cwd,include,exclude){
  // var initPath = util.getBeginPath(pattern_arr)
  // find(initPath,pattern_arr,done)
  if(!(this instanceof MatchFiles)){
    return new MatchFiles(cwd,include,exclude)
  }
  this.cwd = cwd
  this.include = include
  this.exclude = exclude

  this.init()
  return this;
}
util.inherits(MatchFiles,Emitter);

MatchFiles.prototype.init = function(){
  var include = this.include
    , exclude = this.exclude
    , cwd = this.cwd
  var result = []
    , list
    , treestream
    , filterlist = new FilterList()
    , root
    , currentWorkingDir
    , that = this

  root = configUtil.getBeginPath(include)
  filterlist.include(include)
  filterlist.exclude(exclude)
  if(configUtil.isAbsolutePath(root)){
    currentWorkingDir = root
    list = filterlist.getList()
  }else{
    currentWorkingDir = Path.resolve(cwd || process.cwd())
    list = filterlist.getList(currentWorkingDir)
  }
  treestream = new TreeStream(list)

  treestream.on('file',function(path,absPath,wild){
    if(wild){
      var $ = configUtil.makeMoney(wild,absPath)
        , filename = Path.basename(absPath)
        , extname = Path.extname(absPath)
      that.emit('file',absPath,filename,extname,$)
    }
  })
  treestream.on('end',function(){
    that.emit('end')
  })
  treestream.visit(currentWorkingDir)
}
module.exports = MatchFiles