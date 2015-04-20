var siteswap = require('../src/siteswap')
var should = require('should')

describe('bad parameters', function () {
    describe('number of balls', function () {
        it('should throw an error if balls is undefined', function () {
            (function () {
                siteswap.Generator({
                    balls: undefined
                })
            }).should.throw('`balls` is undefined. Expected number or non-null object.')
        })
    
        it('should throw an error if balls is null', function () {
            (function () {
                siteswap.Generator({
                    balls: null
                })
            }).should.throw('`balls` is null. Expected number or non-null object.')
        })
    
        it('should throw an error if balls.max is string', function () {
            (function () {
                siteswap.Generator({
                    balls: {max: 'bla'}
                })
            }).should.throw('`balls.max` is string. Expected number.')
        })
    
        it('should throw an error if balls.max is undefined', function () {
            (function () {
                siteswap.Generator({
                    balls: {}
                })
            }).should.throw('`balls.max` is undefined. Expected number.')
        })
    
        it('should throw an error if balls.min is boolean', function () {
            (function () {
                siteswap.Generator({
                    balls: {max: 3, min: true}
                })
            }).should.throw('`balls.min` is boolean. Expected number or undefined.')
        })
    
        it('should throw an error if balls.min is object', function () {
            (function () {
                siteswap.Generator({
                    balls: {max: 1, min: {}}
                })
            }).should.throw('`balls.min` is object. Expected number or undefined.')
        })
    })

    describe('period', function () {
        it('should throw an error if period is undefined', function () {
            (function () {
                siteswap.Generator({
                    balls : {min: 1, max: 3}, 
                    period: undefined
                })
            }).should.throw('`period` is undefined. Expected number or non-null object.')
        })
    
        it('should throw an error if period is string', function () {
            (function () {
                siteswap.Generator({
                    balls : {min: 1, max: 3},
                    period: 'bla'
                })
            }).should.throw('`period` is string. Expected number or non-null object.')
        })
    
        it('should throw an error if period.max is boolean', function () {
            (function () {
                siteswap.Generator({
                    balls : {min: 1, max: 3},
                    period: {max: true}
                })
            }).should.throw('`period.max` is boolean. Expected number.')
        })
    
        it('should throw an error if period.max is null', function () {
            (function () {
                siteswap.Generator({
                    balls : {min: 1, max: 3},
                    period: {max: null}
                })
            }).should.throw('`period.max` is null. Expected number.')
        })
    
        it('should throw an error if period.min is object', function () {
            (function () {
                siteswap.Generator({
                    balls : {min: 1, max: 3},
                    period: {max: 3, min: {}}
                })
            }).should.throw('`period.min` is object. Expected number or undefined.')
        })
    
        it('should throw an error if period.min is function', function () {
            (function () {
                siteswap.Generator({
                    balls : {min: 1, max: 3},
                    period: {max: 1, min: function (){}}
                })
            }).should.throw('`period.min` is function. Expected number or undefined.')
        })
    })

    describe('height', function () {
        it('should throw an error if height is string', function () {
            (function () {
                siteswap.Generator({
                    balls : {min: 1, max: 3}, 
                    period: {min: 2, max: 3},
                    height: 'bla'
                })
            }).should.throw('`height` is string. Expected number or non-null object.')
        })
    
        it('should throw an error if height is function', function () {
            (function () {
                siteswap.Generator({
                    balls : {min: 1, max: 3},
                    period: {min: 2, max: 3},
                    height: function() {}
                })
            }).should.throw('`height` is function. Expected number or non-null object.')
        })
    
        it('should throw an error if height.max is null', function () {
            (function () {
                siteswap.Generator({
                    balls : {min: 1, max: 3},
                    period: {min: 2, max: 3},
                    height: {max: null}
                })
            }).should.throw('`height.max` is null. Expected number.')
        })
    
        it('should throw an error if height.max is function', function () {
            (function () {
                siteswap.Generator({
                    balls : {min: 1, max: 3},
                    period: {min: 2, max: 3},
                    height: {max: function () {}}
                })
            }).should.throw('`height.max` is function. Expected number.')
        })
    
        it('should throw an error if height.min is string', function () {
            (function () {
                siteswap.Generator({
                    balls : {min: 1, max: 3},
                    period: {min: 2, max: 3},
                    height: {max: 3, min: 'bla'}
                })
            }).should.throw('`height.min` is string. Expected number or undefined.')
        })
    
        it('should throw an error if height.min is null', function () {
            (function () {
                siteswap.Generator({
                    balls : {min: 1, max: 3},
                    period: {min: 2, max: 3},
                    height: {max: 1, min: null}
                })
            }).should.throw('`height.min` is null. Expected number or undefined.')
        })
    })

})

describe('height', function () {
    describe('height', function () {
        it('should throw an error if height is string', function () {
            (function () {
                siteswap.Generator({
                    balls : {min: 1, max: 3},
                    period: {min: 2, max: 3},
                    height: 'bla'
                })
            }).should.throw('`height` is string. Expected number or non-null object.')
        })
    
        it('should throw an error if height is function', function () {
            (function () {
                siteswap.Generator({
                    balls : {min: 1, max: 3},
                    period: {min: 2, max: 3},
                    height: function() {}
                })
            }).should.throw('`height` is function. Expected number or non-null object.')
        })
    
        it('should throw an error if height.max is null', function () {
            (function () {
                siteswap.Generator({
                    balls : {min: 1, max: 3},
                    period: {min: 2, max: 3},
                    height: {max: null}
                })
            }).should.throw('`height.max` is null. Expected number.')
        })
    
        it('should throw an error if height.max is function', function () {
            (function () {
                siteswap.Generator({
                    balls : {min: 1, max: 3},
                    period: {min: 2, max: 3},
                    height: {max: function () {}}
                })
            }).should.throw('`height.max` is function. Expected number.')
        })
    
        it('should throw an error if height.min is string', function () {
            (function () {
                siteswap.Generator({
                    balls : {min: 1, max: 3},
                    period: {min: 2, max: 3},
                    height: {max: 3, min: 'bla'}
                })
            }).should.throw('`height.min` is string. Expected number or undefined.')
        })
    
        it('should throw an error if height.min is null', function () {
            (function () {
                siteswap.Generator({
                    balls : {min: 1, max: 3},
                    period: {min: 2, max: 3},
                    height: {max: 1, min: null}
                })
            }).should.throw('`height.min` is null. Expected number or undefined.')
        })
    })
})

describe('trivial returns', function () {
    it('should return empty array if balls.min is greater than balls.max. ', function () {
        siteswap.Generator({
            balls : {min: 3, max: 1},
            period: 1
        }).should.be.eql([])
    })
    it('should return empty array if interval of balls is under 0.', function () {
        siteswap.Generator({
            balls : {min: -3, max: -1},
            period: 1
        }).should.be.eql([])
    })
    it('should return [[1]] if balls is 1 and period is 1. ', function () {
        siteswap.Generator({
            balls : 1,
            period: 1
        }).should.be.eql([[1]])
    })
    it('should return [[3]] if balls is 3 and period is 1. ', function () {
        siteswap.Generator({
            balls : 3,
            period: 1
        }).should.be.eql([[3]])
    })
    it('should return empty array if balls is 3, period is 1 and height lower than 3. ', function () {
        siteswap.Generator({
            balls : 3,
            period: 1,
            height: 2
        }).should.be.eql([])
    })
    it('should return [[3]] if balls is 3, period is 1 and height greater or equal than 3. ', function () {
        siteswap.Generator({
            balls : 3,
            period: 1,
            height: 3
        }).should.be.eql([[3]])
    })
    it('should return [[5]] if balls is 5, period is 1 and height greater or equal than 5. ', function () {
        siteswap.Generator({
            balls : 5,
            period: 1,
            height: 8
        }).should.be.eql([[5]])
    })
    it('should return [[1]] if balls is 1, period is from 1 to 3 and height is 1.', function () {
        siteswap.Generator({
            balls : 1,
            period: {min: 1, max: 3},
            height: 1
        }).should.be.eql([[1]])
    })
    it('should return empty array if balls is 1, period is from 3 to 3 and height is 1. Note that [1,1,1] is equivalent to 1-period pattern [1]', function () {
        siteswap.Generator({
            balls : 1,
            period: {min: 3, max: 3},
            height: 1
        }).should.be.eql([])
    })
})

describe('complex returns', function () {
    it('should return array of all non-repeated patterns from 1 to 3 balls and period 1', function () {
        siteswap.Generator({
            balls : {min: 1, max: 3},
            period: 1
        }).sort().should.be.eql([[1], [2], [3]])
    })
    it('should return array of all non-repeated patterns from -6 to 3 balls and period 1', function () {
        siteswap.Generator({
            balls : {min: -6, max: 3},
            period: 1
        }).sort().should.be.eql([[0],[1], [2], [3]])
    })
    it('should return array of all non-repeated patterns width 1 ball and periods from 1 to 3', function () {
        siteswap.Generator({
            balls : 1,
            period: 3
        }).sort().should.be.eql([[1], [2,0], [2,0,1], [3,0,0]])
    })
    it('should return array of all non-repeated patterns width 3 balls and period from 3 to 3 and height 5', function () {
        siteswap.Generator({
            balls : 3,
            period: {min: 3, max:3}, 
            height: 5
        }).sort().should.be.eql([[4,2,3], [4,4,1], [5,0,4], [5,2,2], [5,3,1]])
    })
    it('should return array of all non-repeated patterns width 3 balls and period from 3 to 3', function () {
        siteswap.Generator({
            balls : 3,
            period: {min: 3, max:3}
        }).sort().should.be.eql([
            [4,2,3], [4,4,1], 
            [5,0,4], [5,2,2], [5,3,1],
            [6,0,3], [6,1,2], [6,3,0],
            [7,1,1], [7,2,0],
            [8,0,1],
            [9,0,0]
        ])
    })
    it('should return array of all non-repeated patterns from 1 to 3 balls and period from 1 to 3 and height 5', function () {
        siteswap.Generator({
            balls : {min: 1, max:3},
            period: {min: 1, max:3},
            height: 5
        }).sort().should.be.eql([
            [1],
            [2], [2,0], [2,0,1],
            [3], [3,0,0], [3,1], [3,1,2], [3,3,0],
            [4,0], [4,1,1], [4,2], [4,2,0], [4,2,3], [4,4,1], 
            [5,0,1], [5,0,4], [5,1], [5,2,2], [5,3,1]
        ])
    })
    it('should return array of all non-repeated patterns from 3 to 4 balls and period from 2 to 5 and height from 4 to 8', function () {
        siteswap.Generator({
            balls : {min: 3, max:4}, 
            period: {min: 2, max:5},
            height: 5
        }).sort().should.be.eql([
            [4,2], [4,2,3], [4,2,3,3], [4,2,3,3,3], [4,2,4,2,3],
            [4,4,1], [4,4,1,3], [4,4,1,3,3], [4,4,1,4,2], [4,4,4,0], [4,4,4,0,3],
            [5,0,2,4,4], [5,0,4],
            [5,1], [5,1,2,3,4], [5,1,2,4], [5,1,4,1,4], [5,1,4,5,0],
            [5,2,2], [5,2,2,3], [5,2,2,3,3], [5,2,2,4,2], [5,2,4,1], [5,2,4,1,3], [5,2,4,4,0], [5,2,5,1,2],
            [5,3], [5,3,0,3,4], [5,3,0,4], [5,3,0,5,2], [5,3,1], [5,3,1,3], [5,3,1,3,3], [5,3,1,4,2], [5,3,4], [5,3,4,0], [5,3,4,0,3], [5,3,4,4], [5,3,4,4,4], [5,3,5,0,2], [5,3,5,3,4],
            [5,5,0,1,4], [5,5,0,5,0], [5,5,1,1], [5,5,1,1,3], [5,5,1,4,0], [5,5,2], [5,5,2,0], [5,5,2,0,3], [5,5,2,4], [5,5,2,4,4], [5,5,2,5,3], [5,5,5,0,0], [5,5,5,1], [5,5,5,1,4], [5,5,5,5,0],
        ])
    })
})