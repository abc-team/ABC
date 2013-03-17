// -*- coding: utf-8; -*-
// see https://github.com/andreyvit/pathspec.js
var fs = require('fs')
  , Path = require('path')
  , util = require('util')
  , Emitter = require('events').EventEmitter
  , Matcher = require('./path-matcher')

function TreeStream(filterlist){
  this.depth = 0
  this.filterlist = filterlist
}

util.inherits(TreeStream,Emitter)

TreeStream.prototype.enter = function(){
  this.depth +=1
}
TreeStream.prototype.leave = function(){
  this.depth -=1
  if(this.depth == 0)
    this.emit('end')
}
TreeStream.prototype.visit = function(root){
  this._root = root
  this._visit(root)
}
TreeStream.prototype._visit = function(root,path){
  this.enter()
  var absPath = Path.join(root,path)
    , that = this
  fs.stat(absPath,function(err,stats){
    if(err){
      that.emit('error',err)
    }else{
      if(stats.isDirectory()){
        if(path && that.filterlist && that.filterlist.length){
          var result = Matcher.matches(that.filterlist,Path.resolve(that._root,absPath),true)
          // console.log(that.filterlist)
          // console.log(Path.resolve(that._root,absPath))
          // console.log(result)
          // console.log('------------')

          if(result){
            that._tranverse(root,path,absPath)
          }
        }else{
          that._tranverse(root,path,absPath)
        }
      }else{
        var abs = Path.resolve(that._root,absPath)
        if(that.filterlist){
          var wild = Matcher.matches(that.filterlist,abs)
          that.emit('file',path,abs,wild)
        }else{
          that.emit('file',path,abs)
        }
      }
      that.leave()
    }
  })
}
TreeStream.prototype._tranverse = function(root,parent,absParent){
  this.enter()
  this.emit('folder',parent,absParent)

  var that = this
  fs.readdir(absParent,function(err,names){
    if(err){
      that.emit('error',err)
    }else{
      names.forEach(function(name){
        that._visit(root,Path.join(parent,name))
      })
    }
    that.leave()
  })
}

module.exports = TreeStream