/**
 * 任务类
 * @param {Object} obj
 * @param {ABC} abc
 * @constructor
 */
function Task(obj, abc) {
    var self = this;
    self.abc = abc;
    if(!obj.type) {
        throw new Error('no task.type')
    }
    self.type = obj.type;
    self.name = obj.name;
    self.source = obj.source;
}

_.extend(Task.prototype, {
    /**
     * getParsedConfig
     */
    getConfig: function() {
        var self = this;
        self.abc.getConfig(self.type, self.name);
    },

    /**
     * 解析src and dest 参数 生成文件列表
     */
    files: function() {

    },

    /**
     * 检查任务格式是否正确
     */
    check: function(){

    }

});

module.exports = Task;