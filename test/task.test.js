var ABC = require('../lib/abc');
var Task = require('../lib/task');
require('should');

describe("Task Test", function(){
    var abc;
    var task;

    before(function(){
        abc = new ABC({

            vars: {
                foo: 'bar'
            },

            configs: {
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
                "default": []
            }
        });
    });

    describe("config getter", function() {
        var task;
        before(function(){
            task = new Task({name:'log', type:'start'}, abc);
        });

        it('should get the specific config', function() {
            task.config().should.eql({
                message: 'Welcome to xxx'
            });
        });
    });
});