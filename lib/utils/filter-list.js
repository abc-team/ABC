// -*- coding: utf-8-unix; -*-

var Matcher = require('./path-matcher')
  , util = require('./config-util')

function FilterList(){
  this.result = []
}

FilterList.prototype.include = function(a){
  if(util.isString(a))
    this.result.push(a)
  else
    this.result = this.result.concat(a)
}
FilterList.prototype.exclude = function(a){
  var result = this.result
  if(util.isString(a)){
    result.push('!'+a)
  }else{
    a.forEach(function(i){
      result.push('!'+i)
    })
  }
}

FilterList.prototype.getList = function(){
  return this.result
}

module.exports = FilterList