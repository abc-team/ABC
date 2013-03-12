// -*- coding: utf-8; -*-
function escapeRegExp(str){
  return str.replace(/([\/'*+?|()\[\]{}.^$])/g, '\\$1');
}

function buildRegExpFromWild(wild){
  var tmp = wild.split('*')
    , tmp2 = []
    , len
    , regexp
  len = tmp.length
  tmp.forEach(function(s){
    tmp2.push(escapeRegExp(s))
  })
  regexp = new RegExp('^'+tmp2.join('.*?')+'$')
  return regexp
}

/**
 * find wild in astr from index j
 */
function find(wild,astr,j){
  if(wild.indexOf('*') > -1){
    var regexp = buildRegExpFromWild(wild)
    while(astr[j]){
      if(regexp.test(astr[j])){
        return j
      }
      j++
    }
    return -1
  }else{
    return astr.indexOf(wild,j)
  }
}

/**
 * test if str match wild
 * wild 和 str 为绝对路径
 * @param wild {String}
 * @param str {String}
 * @param reverse {Bool} 反向匹配
 */
function match(wild,str,reverse){
  // 两个"*"以上的的替换为两个
  wild = wild.replace(/\*{2,}/g,'**')
  // "..foo/**a/bla..." --->  "..foo/**/*a/bla..."
  wild = wild.replace(/\*\*(\w)?/g,'**/*$1')

  var awild = wild.split('/')
    , astr = str.split('/')
    , i // for wild
    , j // for str
  i = j = 0
  // a shortcut way to judge if no "**"
  if(!reverse && wild.indexOf('**') == -1 && awild.length != astr.length)
    return false

  while(astr[j]){
    var s = astr[j]
      , w = awild[i]

    if(w.indexOf('**') > -1){
      // 以"**"结尾，匹配所有的
      if(i+2>awild.length)return true
      i = i+1
      // 这样的转换 "..foo/**/bla..." --->  "..foo/**/*/bla..." 特殊处理，指针i往前移动1位
      // 注意，这种不做特殊处理的： "..foo/**a/bla..." --->  "..foo/**/*a/bla..." 。 awild[i] == '*a'
      while(awild[i] == '*'){
        i = i+1
      }
      j = find(awild[i],astr,j)
      if(j>-1){
        i = i+1
        j = j+1
        continue
      }else{
        return false
      }
    }else if(w.indexOf('*') > -1){
      var regexp = buildRegExpFromWild(w)
      if(!regexp.test(s))
        return false
    }else{
      if(w != s)return false
    }
    i++
    j++
  }
  if(reverse && !astr[j])
    return true

  return !awild[j]
}

function matches(wilds,str,reverse){
  for(var i=0,l=wilds.length;i<l;i++){
    var wild = wilds[i]
      , answer
    if(wild[0] == '!'){
      wild = wild.slice(1)
      answer = false
    }else{
      answer = true
    }
    if(match(wild,str,reverse))
      return answer
  }
  return false
}

module.exports.match = match
module.exports.matches = matches
