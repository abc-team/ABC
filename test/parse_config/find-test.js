var find = require('../lib/utils/find')
  , FilterList = require('../lib/utils/filter-list')

var filterlist = new FilterList()
  , list
filterlist.include('*.js')
filterlist.exclude('index.js')

list = filterlist.getList()

// ƥ���ļ����������ҷ���match�������ļ�
// find(root,filterlist,callback)
find('.',list,function(list){
  //��ǰĿ¼�£�����ƥ������������·�� list
})
