var should = require('should');

describe("Utils Embed Object", function(){
    var configUtil = require('../../lib/utils/configUtil');

    describe('with Object', function(){
        var result, renderResult;
        before(function(){
            result = configUtil.compile({
                foo: "{{bar}}",
                plain: "plain",
                tao: {
                    bao: "{{name}}"
                },

                list: [
                    "{{name}} 1",
                    "{{name}} 2",
                    "{{undefinedVar}}xx"
                ]
            });
            renderResult = configUtil.render(result, {
                bar: 'foo',
                name: 'Taobao'
            });
        });

        it('compile element', function(){
            result.foo.should.be.an.instanceOf(Function);
        });

        it('should child element', function(){
            result.tao.bao.should.be.an.instanceOf(Function);
        });

        it('compile child array', function(){

            result.list.should.be.an.instanceOf(Array).and.length(3);
            result.list.forEach(function(item){
                item.should.be.an.instanceOf(Function);
            });
        });

        it('should render right', function(){
            renderResult.should.eql({
                foo: 'foo',
                plain: 'plain',
                tao: {
                    bao: 'Taobao'
                },
                list: [
                    'Taobao 1',
                    'Taobao 2',
                    'xx'
                ]
            });


        });

    });


    describe('对象循环引用', function(){
        var result, renderResult;
        before(function(){
            var foo = {};


            foo.bar = {
                foo: foo,
                name: 'bar {{name}}'
            };

            result = configUtil.compile({
                r: foo
            });

            renderResult = configUtil.render(result, {
                name: 'Taobao'
            });
        });

        it('循环嵌套', function () {
            should.not.exist(result.r.bar.foo);

        });

        it('should compile', function(){
            result.r.bar.name.should.be.an.instanceOf(Function);
        });


        it('should render', function(){
            renderResult.r.bar.name.should.eql('bar Taobao');
        })

    });
});