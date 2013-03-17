// -*- coding: utf-8; -*-
var Path = require('path')

function isString(o){
  return toString.call(o) === '[object String]'
}

exports.isString = isString

// a/b/c   -> cwd+/a
// *a/b/c  -> cwd
// **a/b/c -> /
// /a/b/c  -> /a
function getRootFromString(strs,cwd){
  if(!strs) return Path.sep

  cwd || (cwd = process.cwd())
  var astr = strs.split(Path.sep)
  var str = astr[0]

  if(str.indexOf('**') > -1){
    return Path.sep
  }else if(str.indexOf('*') > -1){
    return cwd
  }else if(str == ''){
    return Path.sep+astr[1]
  }else{
    return cwd+Path.sep+str
  }
}
exports.getRootFromString = getRootFromString

// a/b/*/*.js -> a/b
// a/**/*.js  -> a
function getProperPath(str){
  var i = str.indexOf('*')
    , p
    , pa
  if(i>-1){
    p = str.slice(0,i)
  }
  pa = p.split(Path.sep)
  pa.pop()
  return pa.join(Path.sep)
}
exports.getProperPath = getProperPath;

// 测试一个路径是否为绝对路径
// '/'开始的为绝对路径
// 通配符"**"开始的路径也看做绝对路径
// TODO C://path/filename 也是绝对路径
function isAbsolutePath(p){
  return p[0] === Path.sep
      || p.slice(0,2) == "**"
}
exports.isAbsolutePath = isAbsolutePath

function getBeginPath(path_pattern_arr){
  var max = path_pattern_arr[0]
  if(isString(path_pattern_arr)){
    path_pattern_arr = [path_pattern_arr]
  }
  for(var i=1;i<path_pattern_arr.length;i++){
    var p
    p = getProperPath(path_pattern_arr[i])
    if(p && p.length<max.length){
      max = p
    }
  }
  return max
}

exports.getBeginPath = getBeginPath

function makeMoney(wild,path){
  wild = wild.replace(/\*{2,}/g,'(.@)')
             .replace(/\*/g,'(.@?)')
             .replace(/\@/g,'*')
  var re = new RegExp(wild,'g')
    , tmp
  tmp = re.exec(path)
  if(tmp){
    return tmp.slice(1)
  }else{
    return []
  }
}
exports.makeMoney = makeMoney