// -*- coding: utf-8; -*-
var util = require('../lib/utils/config-util')
  , FilterList = require('../lib/utils/filter-list')
  , find = require('../lib/utils/find')
  , Matcher = require('../lib/utils/path-matcher')
  , Path = require('path')

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
  })

  it('matches',function(){
    var list = ['*.js', '!bin/*.js']
    Matcher.matches(list,'foo.js').should.be.true;
    Matcher.matches(list,'lib/foo.js').should.be.false;
    Matcher.matches(list,'bin/foo.js').should.be.false;
  })

})

describe('absolute path matcher test',function(){
  it('#abs matche',function(){
    var list = ['/*.js']
    Matcher.match('/*.js','/foo.js').should.be.true;
    Matcher.match('/var/www/f/dropbox/gits/abcenter/ABC/lib/utils/*.js','/var/www/f/dropbox/gits/abcenter/ABC/lib/utils/a.js').should.be.true;

    Matcher.match('/var/www/f/**/abcenter/ABC/lib/utils/*.js','/var/www/f/dropbox/gits/abcenter/ABC/lib/utils/a.js').should.be.true;

    Matcher.match('/var/www/f/*/*.js','/var/www/f/b/a.js').should.be.true;

    Matcher.matches(['/var/www/f/dropbox/gits/abcenter/ABC/test/parse_config/src/a.js','/var/www/f/dropbox/gits/abcenter/ABC/test/parse_config/src/b.js'],'/var/www/f/dropbox/gits/abcenter/ABC/test/parse_config/src/c.js').should.be.false;

    Matcher.matches([ '/var/www/f/dropbox/gits/abcenter/ABC/test/parse_config/**/a.js','/var/www/f/dropbox/gits/abcenter/ABC/test/parse_config/**/b.js' ],'/var/www/f/dropbox/gits/abcenter/ABC/test/parse_config/src/a.js').should.be.true;

  })
})


describe('match 反向匹配',function(){

  it('reverse match',function(){

    Matcher.match('lib/foo/bar/*.js','lib/foo',true).should.be.true;
    Matcher.match('lib/foo/bar/*.js','lib/bar',true).should.be.false;
    Matcher.matches([ '/var/www/f/dropbox/gits/abcenter/ABC/test/parse_config/**/a.js',
  '/var/www/f/dropbox/gits/abcenter/ABC/test/parse_config/**/b.js'],'/var/www/f/dropbox/gits/abcenter/ABC/test/parse_config/src',true).should.be.true;
  })

})

describe('Node.js path.resolve test',function(){
  it('#resolve',function(){
    (Path.resolve('/a/b','../**/*.js')).should.eql('/a/**/*.js');
  })
})


describe('find file with wildcard',function(){
  return;
  var root = process.cwd()
    , p
    , found
  p = root + '/parse_config/src/'

  before(function(next){
    find('parse_config/src','*.js',function(list){
      found = list
      next()
    })
  })
  describe('#find',function(){
    it('*.js',function(){
      found.should.eql([p+'a.js',p+'b.js',p+'c.js'])
    })
  })

})


describe('find file with wildcard2',function(){
  var root = process.cwd()
    , p
    , found
  p = root + '/parse_config/src/'

  before(function(done){
    find('parse_config/**',['a.js','b.js'],function(list){
      found = list
      done()
    })
  })

  describe('#find',function(){
    it('find two js file',function(){
      found.should.eql([p+'a.js',p+'b.js'])
    })
  })
})
