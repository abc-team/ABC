/**
 * Log Plugin
 * @param abc {ABC}  当前 abc 实例
 * @param config {Object} 插件的全局初始化配置
 * @return {Function}
 */
module.exports = function (abc, config) {
    // 在这里执行插件的初始化

    return function (runtime, done) {
        // do something
        // Some Info
        var report = {};
        if(runtime.messages) {
            runtime.messages.forEach(function(msg){
                console.log(msg);
            })
        }
        done(null, report);
    }
};