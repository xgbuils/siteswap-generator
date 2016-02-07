var siteswap = require('../index')
var should = require('should')

describe('trivial returns', function () {
    it('should return empty array if balls.min is greater than balls.max. ', function () {
        siteswap.calculate({
            balls : {min: 3, max: 1},
            period: 1
        }).should.be.eql([])
    })
    it('should return empty array if interval of balls is under 0.', function () {
        siteswap.calculate({
            balls : {min: -3, max: -1},
            period: 1
        }).should.be.eql([])
    })
    it('should return [[1]] if balls is 1 and period is 1. ', function () {
        siteswap.calculate({
            balls : 1,
            period: 1
        }).should.be.eql([[1]])
    })
    it('should return [[3]] if balls is 3 and period is 1. ', function () {
        siteswap.calculate({
            balls : 3,
            period: 1
        }).should.be.eql([[3]])
    })
    it('should return empty array if balls is 3, period is 1 and height lower than 3. ', function () {
        siteswap.calculate({
            balls : 3,
            period: 1,
            height: 2
        }).should.be.eql([])
    })
    it('should return [[3]] if balls is 3, period is 1 and height greater or equal than 3. ', function () {
        siteswap.calculate({
            balls : 3,
            period: 1,
            height: 3
        }).should.be.eql([[3]])
    })
    it('should return [[5]] if balls is 5, period is 1 and height greater or equal than 5. ', function () {
        siteswap.calculate({
            balls : 5,
            period: 1,
            height: 8
        }).should.be.eql([[5]])
    })
    it('should return [[1]] if balls is 1, period is from 1 to 3 and height is 1.', function () {
        siteswap.calculate({
            balls : 1,
            period: {min: 1, max: 3},
            height: 1
        }).should.be.eql([[1]])
    })
    it('should return empty array if balls is 1, period is from 3 to 3 and height is 1. Note that [1,1,1] is equivalent to 1-period pattern [1]', function () {
        siteswap.calculate({
            balls : 1,
            period: {min: 3, max: 3},
            height: 1
        }).should.be.eql([])
    })
})

describe('complex returns', function () {
    it('should return array of all non-repeated patterns from 1 to 3 balls and period 1', function () {
        siteswap.calculate({
            balls : {min: 1, max: 3},
            period: 1
        }).sort().should.be.eql([[1], [2], [3]])
    })
    it('should return array of all non-repeated patterns from -6 to 3 balls and period 1', function () {
        siteswap.calculate({
            balls : {min: -6, max: 3},
            period: 1
        }).sort().should.be.eql([[0],[1], [2], [3]])
    })
    it('should return array of all non-repeated patterns width 1 ball and periods from 1 to 3', function () {
        siteswap.calculate({
            balls : 1,
            period: 3
        }).sort().should.be.eql([[1], [2,0], [2,0,1], [3,0,0]])
    })
    it('should return array of all non-repeated patterns width 3 balls and period from 3 to 3 and height 5', function () {
        siteswap.calculate({
            balls : 3,
            period: {min: 3, max:3},
            height: 5
        }).sort().should.be.eql([[4,2,3], [4,4,1], [5,0,4], [5,2,2], [5,3,1]])
    })
    it('should return array of all non-repeated patterns width 3 balls and period from 3 to 3', function () {
        siteswap.calculate({
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
        siteswap.calculate({
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
        siteswap.calculate({
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

describe('generator tests', function () {
    describe('when it is got 1st and 2nd pattern', function () {
        beforeEach(function () {
           this.generator = new siteswap.Generator({
                balls : {min: 3, max:3},
                period: {min: 3, max:3},
                height: {min: 5, max:5},
            })
            this.generator.slice(0,2)
        })

        it('.minLength should be 2', function () {
            this.generator.minLength.should.be.eql(2)
        })
        it('.maxLength should be Infinity', function () {
            this.generator.maxLength.should.be.eql(Infinity)
        })
        it('.length should be undefined', function () {
            should(this.generator.length).be.eql(undefined)
        })
    })

    describe('when it is got all patterns', function () {
        beforeEach(function () {
           this.generator = new siteswap.Generator({
                balls : {min: 3, max:3},
                period: {min: 3, max:3},
                height: {min: 5, max:5},
            })
            this.generator.slice(0,4)
        })

        it('.minLength should be 3', function () {
            this.generator.minLength.should.be.eql(3)
        })
        it('.maxLength should be 3', function () {
            this.generator.maxLength.should.be.eql(3)
        })
        it('.length should be 3', function () {
            this.generator.length.should.be.eql(3)
        })
    })
})