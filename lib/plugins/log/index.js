/**
 * Log Plugin
 * @param abc {ABC}  当前 abc 实例
 * @param config {Object} 插件的全局初始化配置
 * @return {Function}
 */
module.exports = function (abc, config) {
    // 在这里执行插件的初始化

    return function (task, done) {
        // do something
        // Some Info
        var report = {};
        var config = task.config();

        if(config.message) {
            task.log(config.message);
        }

        if(config.messages) {
            config.messages.forEach(function(msg){
                task.log(msg);
            });
        }

        setTimeout(function(){
            done(null, report);
        }, Math.random()*1000);

    }
};