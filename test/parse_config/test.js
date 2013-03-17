// -*- coding: utf-8; -*-
// debugger;

// console.log(Matcher.match('/var/www/f/**/abcenter/ABC/lib/utils/*.js','/var/www/f/dropbox/gits/abcenter/ABC/lib/utils/a.js'))
// console.log(Matcher.match('/var/www/f/*/*.js','/var/www/f/b/a.js'))

// console.log(Matcher.matches([ '/var/www/f/dropbox/gits/abcenter/ABC/test/a.js', '/var/www/f/dropbox/gits/abcenter/ABC/test/b.js'], "/var/www/f/dropbox/gits/abcenter/ABC/test/parse_config/src/c.js"
// ))
// var Matcher = require('../../lib/utils/path-matcher')


// debugger;

// console.log(Matcher.matches(['*.js', '!bin/*.js'],'foo.js'))

function find2(c,s){
  return s.indexOf(c)
}
// makeMoney(/a/*/c/d.js ,/a/b/c/d.js)  --> [b]
function makeMoney(wild,path){
  var i
    , j
    , ret = []
  i=j=0
  while(typeof wild[i] != undefined){
    if(wild[i] == '*'){
      var start = j
        , end
      while(wild[i] == '*'){
        i++
      }
      var j2 = find2(wild[i],path.slice(j))
      if(j2>-1){
        end = j2
        j = j2
        ret.push(path.slice(start,end))
      }else{
        return ret
      }
    }else{
      if(wild[i] != path[j]){
        return ret
      }
      i++
      j++
    }
  }
  return ret
}

// console.log(makeMoney('**/l.js','a/b/c/e/fg/xhij/k/l.js'))

var re1
  , re2
  , s = 'abbb/b/c/d.js'

re1 = /ab+/
re2 = /ab+?/

// *  -> [.+^\/]+?
// ** -> [.+]+
function makeMoney2(wild,path){
  wild = wild.replace(/\*{2,}/g,'(.@)')
             .replace(/\*/g,'(.@?)')
             .replace(/\@/g,'*')
  return wild
}

var wild = '/a/*/c/**/e.js'
  , r = makeMoney2(wild)
s = '/a/b/c/dddd/fff/e.js'

console.log(r)
console.log(wild)
re1 = new RegExp(r,'g')

var result = re1.exec(s)
for(var i=0;i<result.length;i++){
  console.log(result[i])
}
console.log(result.slice(1))
// console.log(s.match(re1))