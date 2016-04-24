var LazyArray = require('lazyarray-lite')
var _ = require('./utils.js')

var PARAM_NAMES = require('./conf/PARAM_NAMES')
var DEFAULT_VALUES = require('./conf/DEFAULT_VALUES')

function Generator(options) {
    this.minLength = 0
    this.maxLength = Infinity
    if (!(this instanceof Generator)) {
        return new Generator(options)
    }
    this.patterns = new LazyArray({
        init: function () {
            this.state = new State(options)
        },
        next: function () {
            return getNextPattern(this.state)
        }
    })
}

function State (options) {
    _.transformParams.call(this, options || {}, PARAM_NAMES)
    _.each(PARAM_NAMES, function (name, i) {
        _.setDefaultValues.call(this, name, 'max', DEFAULT_VALUES[i])
        _.setDefaultValues.call(this, name, 'min', DEFAULT_VALUES[i])
    }, this)

    this.methods = {
        start: {
            b: function () {
                this.b = this.balls.max
                this.bMin = this.balls.min
            },
            p: function () {
                this.p = this.period.max
                this.pMin = Math.max(this.period.min, 1)
            },
            h: function () {
                this.h = Math.min(this.height.max, this.p * this.b)
                this.hMin = Math.max(this.height.min, this.b + (this.p > 1 ? 1 : 0))
            }
        }
    }
}

State.prototype.start = function (ch) {
    this.methods.start[ch].call(this)
}

State.prototype.cond = function (ch) {
    return this[ch] >= this[ch + 'Min']
}

Generator.prototype.slice = function (begin, end) {
    var patterns = this.patterns.slice(begin, end)
    if (typeof this.length !== 'number') {

        this.minLength = Math.min(this.patterns.maxLength, end)
        this.maxLength = Math.min(this.patterns.maxLength, this.maxLength)
        if (this.minLength === this.maxLength) {
            this.length = this.minLength
        }
    }
    return patterns
}

module.exports = Generator

function getNextPattern (state) {
    if (state.b === undefined) {
        state.start('b')
    }

    while (state.cond('b')) {
        if (state.p === undefined) {
            state.start('p')
        }
        
        while (state.cond('p')) {
            if (state.h === undefined) {
                state.start('h')
            }

            while (state.cond('h')) {
                if (!state.siteswapIterator) {
                    state.siteswapIterator = siteswap(state.b, state.p, state.h)
                }
                var x = state.siteswapIterator.next()
                if (!x.done)  {
                    return x.value
                } else {
                    state.siteswapIterator = undefined
                }
                --state.h
            }
            state.h = undefined
            --state.p
        }
        state.p = undefined
        --state.b
    }

    return undefined
}

var compose = require('iterum/src/fn/compose')
var Iterum = require('iterum')
var Empty = Iterum.Empty
var Range = Iterum.Range
var Value = Iterum.Value

function siteswap (balls, period, height) {
    var args = [
        beginningGeneratorCreator(balls, period, height, 0)
    ]
    var length = period - 1;
    for (var index = 1; index < length; ++index) {
        args.push(middleGeneratorCreator(balls, period, height, index))
    }
    args.push(endGeneratorCreator(balls, period, height, length))
    return compose.apply(null, args)()
}

function beginningGeneratorCreator (balls, period, height, index) {
    return function (_) {
        var mod = (height + index) % period
        var options = {
            rest: balls * period - height,
            used: {},
            pattern: [height],
        }
        options.used[mod] = true
        var index = period === 1 ? -1 : 0
        var pointer = 0
        return createNextRange(options, index, pointer, period, height, _)
    }
}

function middleGeneratorCreator (balls, period, height, index) {
    return function (options, h, pointer, _) {
        rebuildOptions(options, period, index)
        
        var mod = (h + index) % period
        if (options.used[mod]) {
            return new Iterum(Empty())
        } else {
            updateOptions(options, mod, h)
            pointer = options.pattern[pointer] > h ? 0 : pointer + 1
            return createNextRange(options, index, pointer, period, height, _)
        }
    }
}

function endGeneratorCreator (balls, period, height, index) {
    return function (options, h, pointer) {
        rebuildOptions(options, period, index)
        
        var mod = (h + index) % period
        if (index === 0) {
            return new Iterum(Value([].concat(options.pattern)))
        } else if (options.used[mod]) {
            return new Iterum(Empty())
        } else {
            updateOptions(options, mod, h)
            pointer = options.pattern[pointer] > h ? 0 : pointer + 1
            if (pointer === 0) {
                return new Iterum(Value([].concat(options.pattern)))
            } else {
                return new Iterum(Empty())
            }
        }
    }
}

function rebuildOptions(options, period, index) {
    var i = options.pattern.length - 1

    while (index > 0 && i >= index) {
        var h = options.pattern.pop()
        var mod = (h + i) % period
        options.used[mod] = undefined
        options.rest += h
        --i
    }
}

function updateOptions (options, mod, h) {
    options.rest -= h
    options.used[mod] = true
    options.pattern.push(h)
}

function createNextRange (options, index, pointer, period, height, _) {
    var maxHeight = Math.min(options.rest, options.pattern[pointer])
    var minHeight = Math.max(options.rest - height * (period - index - 2), 0)
    _(options, _, pointer)
    return new Iterum(Range(maxHeight, minHeight, -1))
}