require('should');

describe("Utils Embed Object", function(){
    var embObj = require('../../lib/utils/embed-object');

    describe('Embed Object', function(){
        var result;
        before(function(){
            result = embObj({
                foo: "{{bar}}",
                tao: {
                    bao: "{{name}}"
                }
            }, {
                bar: 'foo',
                name: 'Taobao'
            });
        });

        it('should render with root attribute foo', function(){
            result.foo.should.eql('foo');
        });

        it('should render children object', function(){
            result.tao.bao.should.eql('Taobao');
        });

    });

    describe('Embed Array', function(){
        var result;
        before(function(){
            result = embObj([
                'bar',
                '{{bar}}',
                ['{{bar}}-{{name}}'],
                {
                    v: 'bar',
                    name: '{{name}}'
                }
            ], {
                bar: 'foo',
                name: 'Taobao'
            });
        });

        it('should string item', function(){
            result.length.should.eql(4);
            result[0].should.eql('bar');
            result[1].should.eql('foo');
        });

        it('should render child array', function(){
            (result[2][0]).should.eql('foo-Taobao');
        });

        it('should render children obj', function(){
            result[3].v.should.eql('bar');
            result[3].name.should.eql('Taobao');
        });

    });

    describe('对象循环引用', function(){
        var result;
        before(function(){
            var foo = {};

            var bar = {
                foo: foo,
                ok: 'ok'
            };

            foo.bar = bar;

            result = embObj({
                r: foo
            });
        });

        it('使循环的变量为空', function () {
            result.should.eql({
                r: {
                    bar: {
                        foo: null,
                        ok: 'ok'
                    }
                }
            })
        });

    });
});