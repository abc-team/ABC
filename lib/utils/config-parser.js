// -*- coding: utf-8; -*-
var _ = require('underscore')
  , path = require('path')
  , util = require('util')
  , fs = require('fs')
  , Emitter = require('events').EventEmitter


//从json中解析出task配置
function parseJSONObject(cfg){
  this.cfg = cfg
}
util.inherits(parseJSONObject,Emitter)

parseJSONObject.prototype.parse = function(json){
  json || (json = this.cfg)
  if(!json){
    throw Error('缺少配置')
  }

  json = _.clone(json)
  var config = json.config
    , tasks = json.tasks
    , vars = config.vars || {}
    , that = this
    , taskconfig = []
  delete config.var
 _.chain(config)
  .pairs(config)
  .map(function(pair,index){
    var key = pair[0]
      , value = pair[1]

   _.chain(value)
    .pairs(value)
    .map(function(task){
      var config = task[1]
        , t = {
          taskname:key
        , taskconfig:config
        , variables:_.clone(vars)
        }
     taskconfig.push(t)
     that.emit('task',t)
    })
  })
  that.emit('end',{
    taskconfig:taskconfig
  })
}

module.exports = parseJSONObject