var setDefaultValues = require('../src/utils').setDefaultValues
var expect = require('chai').expect

var DEFAULT_VALUES = require('../src/conf/DEFAULT_VALUES')

function error (paramName, key) {
    return 'Error: `' + paramName + '.' + key + '` is required and must be a number.'
}

describe('setDefaultValues', function () {
    describe('when balls.max is not defined', function () {
        it('throws an error', function () {
            var context = {
                balls: {}
            }
            expect(function () {
                setDefaultValues.call(context, 'balls', 'max', DEFAULT_VALUES[0], error)
            }).to.Throw('Error: `balls.max` is required and must be a number.')
        })
    })

    describe('when `balls.max` is a number', function () {
        it('property `balls.max` remains with this value', function () {
            var context = {
                balls: {
                    max: 3
                }
            }
            setDefaultValues.call(context, 'balls', 'max', DEFAULT_VALUES[0], error)
            expect(context.balls.max).to.be.equals(3)
        })
    })

    describe('when `balls.min` is not defined', function () {
        it('takes value of `balls.max`', function () {
            var context = {
                balls: {
                    max: 5
                }
            }
            setDefaultValues.call(context, 'balls', 'min', DEFAULT_VALUES[0], error)
            expect(context.balls.min).to.be.equals(5)
        })
    })

    describe('when `period.min` is not defined', function () {
        it('`period.min` is set with 1', function () {
            var context = {
                period: {
                    max: 5
                }
            }
            setDefaultValues.call(context, 'period', 'min', DEFAULT_VALUES[1], error)
            expect(context.period.min).to.be.equals(1)
        })
    })

    describe('when `period.max` is not defined', function () {
        it('property `period.max` has the same value as `balls.max`', function () {
            var context = {
                balls: {
                    max: 3
                },
                period: {}
            }
            setDefaultValues.call(context, 'period', 'max', DEFAULT_VALUES[1], error)
            expect(context.period.max).to.be.equals(3)
        })
    })

    describe('when `period.min` is a number', function () {
        it('property `period.min` remains with this number', function () {
            var context = {
                period: {
                    min: 2
                }
            }
            setDefaultValues.call(context, 'period', 'min', DEFAULT_VALUES[1], error)
            expect(context.period.min).to.be.equals(2)
        })
    })

    describe('when `height.min` is not defined', function () {
        it('`height.min` is set with 0', function () {
            var context = {
                height: {}
            }
            setDefaultValues.call(context, 'height', 'min', DEFAULT_VALUES[2], error)
            expect(context.height.min).to.be.equals(0)
        })
    })

    describe('when `height.max` is not defined', function () {
        it('property `height.max` has the same value as `balls.max` * `period.max`', function () {
            var context = {
                balls: {
                    max: 3
                },
                period: {
                    max: 5
                },
                height: {}
            }
            setDefaultValues.call(context, 'height', 'max', DEFAULT_VALUES[2], error)
            expect(context.height.max).to.be.equals(15)
        })
    })

    describe('when `height.max` is a number', function () {
        it('property `height.max` remains with this number', function () {
            var context = {
                height: {
                    max: 8
                }
            }
            setDefaultValues.call(context, 'height', 'max', DEFAULT_VALUES[2], error)
            expect(context.height.max).to.be.equals(8)
        })
    })
})
