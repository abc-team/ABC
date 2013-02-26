var ABC = require('../lib/abc');
require('should');

describe("ABC Test", function(){

    describe("test parseQueue", function(){
        var parseQueue = ABC.prototype._parseTask;

        it('should parse array of string into array of parsed task', function () {
            var q = parseQueue(['concat:a', 'kmc:b']);
            q.should.eql([
                {
                    type: 'concat',
                    name:'a',
                    source: 'concat:a'
                },
                {
                    type: 'kmc',
                    name: 'b',
                    source: 'kmc:b'
                }
            ], 'normal queue');
        });

        it('should ignore illegal task', function () {
            var q = parseQueue(['foo:bar', 'concat', 'bar:foo']);
            q.should.eql([
                {
                    type: 'foo',
                    name:'bar',
                    source: "foo:bar"
                },
                {
                    type: 'bar',
                    name:'foo',
                    source: 'bar:foo'
                }
            ], 'no illegal task concat');
        });

        it('should ignore illegal task', function () {
            var q = parseQueue(['foo:bar', 'concat']);
            q.should.eql([{
                type: 'foo',
                name:'bar',
                source: 'foo:bar'
            }], 'no illegal task concat');
        });
    });

    describe('new ABC', function() {
        var abc = new ABC({
            vars: {
                foo: 'bar',
                n: 10085
            },
            config: {
                console: {
                    start: {
                        messages: [
                            'log:xxx{foo}',
                            'log:yyy{n}'
                        ]
                    }

                }
            },
            tasks: {
                default: ['console:start']
            }
        });


    });
});