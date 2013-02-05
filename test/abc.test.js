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
                    name:'a'
                },
                {
                    type: 'kmc',
                    name: 'b'
                }
            ], 'normal queue');
        });

        it('should ignore illegal task', function () {
            var q = parseQueue(['foo:bar', 'concat', 'bar:foo']);
            q.should.eql([
                {
                    type: 'foo',
                    name:'bar'
                },
                {
                    type: 'bar',
                    name:'foo'
                }
            ], 'no illegal task concat');
        });

        it('should ignore illegal task', function () {
            var q = parseQueue(['foo:bar', 'concat']);
            q.should.eql([{
                type: 'foo',
                name:'bar'
            }], 'no illegal task concat');
        });
    });
});