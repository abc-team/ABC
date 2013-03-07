// -*- coding: utf-8; -*-
function isString(o){
  return toString.call(o) === '[object String]'
}

exports.isString = isString

// a/b/c   -> cwd+/a
// *a/b/c  -> cwd
// **a/b/c -> /
// /a/b/c  -> /a
function getRootFromString(str){
  if(!str) return '/'
  var cwd = process.cwd()
  if(str.indexOf('**') == 0){
    return '/'
  }else if(str.indexOf('*') == 0){
    return cwd
  }else if(str.indexOf('/') == 0){
    return '/'+str.split('/')[1]
  }else{
    var a = str.split('/')
    return cwd+'/'+a[0]
  }
}
exports.getRootFromString = getRootFromString

// 测试一个路径是否为绝对路径
// '/'开始的为绝对路径
// 通配符"**"开始的路径也看做绝对路径
function isAbsolutePath(p){
  return p[0] === '/'
      || p.slice(0,2) == "**"
}
exports.isAbsolutePath = isAbsolutePath