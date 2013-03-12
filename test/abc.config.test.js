// -*- coding: utf-8; -*-
var util = require('../lib/utils/config-util')
  , FilterList = require('../lib/utils/filter-list')
  , find = require('../lib/utils/find')
  , Matcher = require('../lib/utils/path-matcher')


require('should')

describe('ABC config tool test',function(){
  it('should be absolute path ',function(){
    (util.isAbsolutePath('/a/b/c')).should.be.true;
    (util.isAbsolutePath('**a/b/c')).should.be.true;
  })

  it('should not be absolute path ',function(){
    (util.isAbsolutePath('a/b/c')).should.be.false;
    (util.isAbsolutePath('*a/b/c')).should.be.false;
  })

  it('getRootFromString',function(){
    (util.getRootFromString('a/b/c')).should.eql(process.cwd()+'/a');
    (util.getRootFromString('*a/b/c')).should.eql(process.cwd());
    (util.getRootFromString('**a/b/c')).should.eql('/');
    (util.getRootFromString('/a/b/c')).should.eql('/a');
  })

})


describe('pathname filter list',function(){
  var filterlist = new FilterList()
    , list
  filterlist.include('*.js')
  filterlist.exclude('*.combo.js')

  list = filterlist.getList()

  it('include and exclude',function(){
    list.should.eql(['*.js','!*.combo.js'])
  })


})

describe('async test',function(done){
  var num

  beforeEach(function(done){
    setTimeout(function(){
      num = 1
      done()
    },50)
  })

  it('simple math test',function(){
    num.should.eql(1)
  })

})


describe('matcher test',function(){
  it('match',function(){
    Matcher.match('*.txt','foo.txt').should.be.true;
    Matcher.match('*.txt','foot.js').should.be.false;

    Matcher.match('foo/**/bar/*.txt','foo/moo/goo/bar/myfile.txt').should.be.true;
    Matcher.match('foo.txt','bar/foo.txt').should.be.false;

    // Matcher.match('','').should.be.true;
  })

  it('matches',function(){
    var list = ['*.js', '!bin/*.js']
    Matcher.matches(list,'foo.js').should.be.true;
    Matcher.matches(list,'lib/foo.js').should.be.false;
    Matcher.matches(list,'bin/foo.js').should.be.false;
  })

})

describe('match 反向匹配',function(){

  it('reverse match',function(){

    Matcher.match('lib/foo/bar/*.js','lib/foo',true).should.be.true;
    Matcher.match('lib/foo/bar/*.js','lib/bar',true).should.be.false;

  })

})


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
  var found
  before(function(done){
    find('parse_config/src',['a.js','b.js'],function(list){
      found = list
      done()
    })
  })

  describe('#find',function(){
    it('find two js file',function(){
      found.should.eql(['a.js','b.js'])
    })
  })
})
