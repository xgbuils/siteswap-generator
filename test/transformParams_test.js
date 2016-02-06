var transformParams = require('../src/utils').transformParams
var expect = require('chai').expect

var PARAM_NAMES = require('../src/conf/PARAM_NAMES')

describe('transformParams', function () {
    describe('when balls is a number', function () {
        it('context has property balls.max with this number', function () {
            var context = {}
            var params = {
                balls: 3
            }
            transformParams.call(context, params, PARAM_NAMES)
            expect(context.balls).to.be.deep.equals({
                max: 3
            })
        })
    })

    describe('when balls is an object', function () {
        describe('if has property min or max and are a number', function () {
            it('context.balls has property min or max with this number', function () {
                var context = {}
                var params = {
                    balls: {
                        max: 5,
                        min: 1
                    }
                }
                transformParams.call(context, params, PARAM_NAMES)
                expect(context.balls).to.be.deep.equals({
                    max: 5,
                    min: 1
                })
            })
        })

        describe('if has property min or max and are not a number', function () {
            it('context.balls has not a property min or max', function () {
                var context = {}
                var params = {
                    balls: {
                        max: 'foo'
                    }
                }
                transformParams.call(context, params, PARAM_NAMES)
                expect(context.balls).to.be.deep.equals({})
            })
        })
    })

    describe('when period is a number', function () {
        it('context has property period.max with this number', function () {
            var context = {}
            var params = {
                period: 5
            }
            transformParams.call(context, params, PARAM_NAMES)
            expect(context.period).to.be.deep.equals({
                max: 5
            })
        })
    })

    describe('when period is an object', function () {
        describe('if has property min or max and are a number', function () {
            it('context.period has property min or max with this number', function () {
                var context = {}
                var params = {
                    period: {
                        min: 2
                    }
                }
                transformParams.call(context, params, PARAM_NAMES)
                expect(context.period).to.be.deep.equals({
                    min: 2
                })
            })
        })

        describe('if has property min or max and are not a number', function () {
            it('context.period has not a property min or max', function () {
                var context = {}
                var params = {
                    period: {
                        min: 3,
                        max: 'foo'
                    }
                }
                transformParams.call(context, params, PARAM_NAMES)
                expect(context.period).to.be.deep.equals({
                    min: 3
                })
            })
        })
    })

    describe('when height is an object', function () {
        describe('if has property min or max and are a number', function () {
            it('context.height has property min or max with this number', function () {
                var context = {}
                var params = {
                	period: {
                		max: 1
                	},
                    height: {
                        min: new Number(8)
                    }
                }
                transformParams.call(context, params, PARAM_NAMES)
                expect(context.height).to.be.deep.equals({
                    min: new Number(8)
                })
            })
        })

        describe('if has property min or max and are not a number', function () {
            it('context.height has not a property min or max', function () {
                var context = {}
                var params = {
                    height: {
                    	max: {},
                        min: function () {}
                    }
                }
                transformParams.call(context, params, PARAM_NAMES)
                expect(context.height).to.be.deep.equals({})
            })
        })
    })
})
