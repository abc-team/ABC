/**
 * 插件
 * @param abc {ABC}  当前 abc 实例
 * @param config {Object} 插件的全局初始化配置
 * @return {Function}
 */
module.exports = function (abc, config) {
    // 在这里执行插件的初始化
    // 可以访问 ABC 的工具方法

    return function (runtime, done) {
        // do something
        var report = {};
        done(null, report);
    }
};