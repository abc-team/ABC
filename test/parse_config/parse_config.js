var ConfigParser = require('../../lib/utils/config-parser')
  , config = require('./parse_config.cfg')
  , find = require('../../lib/utils/find')

var parser = new ConfigParser(config)

parser.on('task',function(e){
  // e : {taskname,taskconfig,variables}
  // console.log(e.taskname)
})

parser.on('end',function(e){
  // e.taskconfig is an array of task config
  console.log(e.taskconfig)
})

parser.parse(config)