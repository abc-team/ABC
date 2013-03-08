// -*- coding: utf-8; -*-
function isString(o){
  return toString.call(o) === '[object String]'
}

exports.isString = isString

// a/b/c   -> cwd+/a
// *a/b/c  -> cwd
// **a/b/c -> /
// /a/b/c  -> /a
function getRootFromString(strs,cwd){
  if(!strs) return '/'

  cwd || (cwd = process.cwd())
  var astr = strs.split('/')
  var str = astr[0]

  if(str.indexOf('**') > -1){
    return '/'
  }else if(str.indexOf('*') > -1){
    return cwd
  }else if(str == ''){
    return '/'+astr[1]
  }else{
    return cwd+'/'+str
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