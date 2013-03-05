/**
 * ������
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
     * ����src and dest ���� �����ļ��б�
     */
    files: function() {

    },

    /**
     * ��������ʽ�Ƿ���ȷ
     */
    check: function(){

    }

});

module.exports = Task;