// -*- coding: utf-8; -*-
var fs = require('fs')
  , Path = require('path')
  , util = require('util')
  , Emitter = require('events').EventEmitter

function TreeStream(){
  this.depth = 0
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
        that._tranverse(root,path,absPath)
      }else{
        that.emit('file',path,absPath)
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