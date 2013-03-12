require('should')
var find = require('../lib/utils/find')

describe('find file with wildcard',function(){
  var found
  before(function(next){
    find('parse_config/src','*.js',function(list){
      found = list
      next()
    })
  })

  describe('#find',function(){
    it('*.js',function(){
      found.should.eql(['a.js','b.js','c.js'])
    })
  })
})

describe('find file with wildcard2',function(){
  var ret
  before(function(done){
    find('parse_config/src',['a.js','b.js'],function(list){
      ret = list
      done()
    })
  })

  describe('#find',function(){
    it('find two js file',function(){
      console.log(ret)
      ret.should.eql(['a.js','b.js'])
    })
  })

})