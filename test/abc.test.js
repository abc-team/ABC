var ABC = require('../lib/abc');
var Task = require('../lib/task');
require('should');

describe("ABC Test", function(){
    var abc;

    before(function(){
        abc = new ABC({

            _vars: {
                foo: 'bar'
            },

            _configs: {
                log: {
                    start: {
                        message: "Welcom to xxx"
                    },
                    end: {
                        message: "Welcom to {{foo}}"
                    }
                }
            },

            tasks: {
                "default": ['log:start','log:end']
            }
        });
    });

    describe("test getConfig", function() {

        it('should parse the string', function() {
            var config = abc.getConfig('log', 'start');

            config.should.eql({
                message: "Welcom to xxx"
            });
        });

        it('should parse the template', function () {
            var config = abc.getConfig('log', 'end');
            config.should.eql({
                message: "Welcom to bar"
            })
        });

    });

    describe("test get Queue", function() {

        it('should get an Array', function(){
            abc.getQueue('default').should.be.an.instanceOf(Array);
        });

        it('should get a Array with 2 element', function(){
            abc.getQueue('default').should.have.length(2);
        });

        it('should be an array of Task', function(){
            abc.getQueue('default').forEach(function(task){
                task.should.be.an.instanceOf(Task);
            });
        });

        it('should have public property type, name, and source', function(){
            var startLog = abc.getQueue('default')[0];
            startLog.should.have.property('type','log')
            startLog.should.have.property('name','start')
            startLog.should.have.property('source','log:start');
            startLog.config().should.eql({
                message: 'Welcom to xxx'
            });

            var endLog = abc.getQueue('default')[1];
            endLog.should.have.property('type','log')
            endLog.should.have.property('name','end')
            endLog.should.have.property('source','log:end');
            endLog.config().should.eql({
                message: 'Welcom to bar'
            });
        });
    });

    describe("test run", function() {
        before(function(done){
            abc.execQueue('default', done)
        });
    });
});