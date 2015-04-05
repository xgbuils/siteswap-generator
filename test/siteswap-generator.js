var siteswapGenerator = require('../src/siteswap-generator')
var should = require('should')

describe('number of balls', function () {
    describe('bad parameters', function () {
        it('should throw an error if balls is undefined', function () {
            (function () {
                siteswapGenerator(undefined)
            }).should.throw('`balls` is undefined. Expected number or non-null object.')
        })
    
        it('should throw an error if balls is null', function () {
            (function () {
                siteswapGenerator(null)
            }).should.throw('`balls` is null. Expected number or non-null object.')
        })
    
        it('should throw an error if balls.max is string', function () {
            (function () {
                siteswapGenerator({max: 'bla'})
            }).should.throw('`balls.max` is string. Expected number.')
        })
    
        it('should throw an error if balls.max is undefined', function () {
            (function () {
                siteswapGenerator({})
            }).should.throw('`balls.max` is undefined. Expected number.')
        })
    
        it('should throw an error if balls.min is boolean', function () {
            (function () {
                siteswapGenerator({max: 3, min: true})
            }).should.throw('`balls.min` is boolean. Expected number or undefined.')
        })
    
        it('should throw an error if balls.min is object', function () {
            (function () {
                siteswapGenerator({max: 1, min: {}})
            }).should.throw('`balls.min` is object. Expected number or undefined.')
        })
    })
})

describe('period', function () {
    describe('bad parameters', function () {
        it('should throw an error if period is undefined', function () {
            (function () {
                siteswapGenerator({max: 1, min: 3}, undefined)
            }).should.throw('`period` is undefined. Expected number or non-null object.')
        })
    
        it('should throw an error if period is string', function () {
            (function () {
                siteswapGenerator({max: 1, min: 3}, 'bla')
            }).should.throw('`period` is string. Expected number or non-null object.')
        })
    
        it('should throw an error if period.max is boolean', function () {
            (function () {
                siteswapGenerator({max: 1, min: 3}, {max: true})
            }).should.throw('`period.max` is boolean. Expected number.')
        })
    
        it('should throw an error if period.max is null', function () {
            (function () {
                siteswapGenerator({max: 1, min: 3}, {max: null})
            }).should.throw('`period.max` is null. Expected number.')
        })
    
        it('should throw an error if period.min is object', function () {
            (function () {
                siteswapGenerator({max: 1, min: 3}, {max: 3, min: {}})
            }).should.throw('`period.min` is object. Expected number or undefined.')
        })
    
        it('should throw an error if period.min is function', function () {
            (function () {
                siteswapGenerator({max: 1, min: 3}, {max: 1, min: function (){}})
            }).should.throw('`period.min` is function. Expected number or undefined.')
        })
    })
})

describe('height', function () {
    describe('bad parameters', function () {
        it('should throw an error if height is undefined', function () {
            (function () {
                siteswapGenerator({max: 1, min: 3}, {min: 2, max: 3}, undefined)
            }).should.throw('`height` is undefined. Expected number or non-null object.')
        })
    
        it('should throw an error if height is function', function () {
            (function () {
                siteswapGenerator({max: 1, min: 3}, {min: 2, max: 3}, function() {})
            }).should.throw('`height` is function. Expected number or non-null object.')
        })
    
        it('should throw an error if height.max is null', function () {
            (function () {
                siteswapGenerator({max: 1, min: 3}, {min: 2, max: 3}, {max: null})
            }).should.throw('`height.max` is null. Expected number.')
        })
    
        it('should throw an error if height.max is function', function () {
            (function () {
                siteswapGenerator({max: 1, min: 3}, {min: 2, max: 3}, {max: function () {}})
            }).should.throw('`height.max` is function. Expected number.')
        })
    
        it('should throw an error if height.min is string', function () {
            (function () {
                siteswapGenerator({max: 1, min: 3}, {min: 2, max: 3}, {max: 3, min: 'bla'})
            }).should.throw('`height.min` is string. Expected number or undefined.')
        })
    
        it('should throw an error if height.min is null', function () {
            (function () {
                siteswapGenerator({max: 1, min: 3}, {min: 2, max: 3}, {max: 1, min: null})
            }).should.throw('`height.min` is null. Expected number or undefined.')
        })
    })
})