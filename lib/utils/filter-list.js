// -*- coding: utf-8-unix; -*-

var util = require('./config-util')
  , Path = require('path')

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

// 有cwd，转成resolve后的绝对路径
FilterList.prototype.getList = function(cwd){
  var ret
  if(cwd){
    ret = this.result.map(function(li){
            return Path.resolve(cwd,li)
          })
  }else{
    ret  = this.result
  }
  return ret
}

module.exports = FilterList