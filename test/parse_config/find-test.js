var find = require('../lib/utils/find')
  , FilterList = require('../lib/utils/filter-list')

var filterlist = new FilterList()
  , list
filterlist.include('*.js')
filterlist.exclude('index.js')

list = filterlist.getList()

// 匹配文件——即查找符合match条件的文件
// find(root,filterlist,callback)
find('.',list,function(list){
  //当前目录下，满足匹配条件的所有路径 list
})
