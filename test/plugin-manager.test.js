var PluginManager = require('../lib/plugin-manager');
var ABC = require('../lib/abc');
require('should');

describe("PluginManager Test", function(){

    describe("add function", function() {
        var pm;
        var abcObj = {};
        var initConfig = {};
        var abc = new ABC({
            tasks: {
                default: []
            }
        });

        var p1 = function(abc, initConfig) {
            abc.should.eql(abcObj, 'plugin abc param');
            initConfig.should.eql(initConfig, 'initConfig should passed in');
            return function(runtime, done){
                runtime.foo.should.eql('bar');
                done();
            }
        };

        before(function() {
            pm = new PluginManager(abcObj);
        });

        it('should work with function', function () {
            pm.add('foo', p1, initConfig);
        });

        it('should exec the foo plugin with configs', function(done){
            pm.exec('foo', done);
        });
    });

    describe("add log plugin by filepath", function(){
        var pm;
        var abcObj = {};
        var initConfig = {};
        var p1 = '../lib/plugins/log/index';

        before(function() {
            pm = new PluginManager(abcObj);
        });

        it('should work with function', function () {
            pm.add('log', p1, initConfig);
        });

        it('should exec the foo plugin with configs', function(done){
            pm.exec('log', {content:'log content'}, done);
        });
    });

    describe("add log plugin by filepath", function(){
        var pm;
        var abcObj = {};
        var initConfig = {};
        var p1 = '../lib/plugins/log/log';

        before(function() {
            pm = new PluginManager(abcObj);
        });

        it('should work with function', function () {
            pm.add('log', p1, initConfig);
        });

        it('should exec the foo plugin with configs', function(done){
            pm.exec('log', {content:'log content'}, done);
        });
    });

    describe("add log plugin by npm module name", function(){
        var pm;
        var abcObj = {};
        var initConfig = {};
        var p1 = 'abc-plugin-log';

        before(function() {
            pm = new PluginManager(abcObj);
        });

        it('should work with function', function () {
            pm.add('log', p1, initConfig);
        });

        it('should exec the foo plugin with configs', function(done){
            pm.exec('log', {log:'color log content'}, done);
        });
    });
});