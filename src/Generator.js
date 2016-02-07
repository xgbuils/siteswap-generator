var LazyArray           = require('lazyarray-lite')
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
            _.transformParams.call(this, options || {}, PARAM_NAMES)
            _.each(PARAM_NAMES, function (name, i) {
                _.setDefaultValues.call(this, name, 'max', DEFAULT_VALUES[i])
                _.setDefaultValues.call(this, name, 'min', DEFAULT_VALUES[i])
            }, this)

            this.b = this.balls.max
        },
        next: function () {
            return getNextPattern(this)
        }
    })
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
    while (state.b >= state.balls.min) {
        if (state.p === undefined) {
            state.p = state.period.max
            periodMin = Math.max(state.period.min, 2)
        }
        
        while (state.p >= periodMin) {
            if (state.h === undefined) {
                heightMax = Math.min(state.height.max, state.p * state.b)
                heightMin = Math.max(state.height.min, state.b + 1)
                state.h = heightMax
            }

            while (state.h >= heightMin) {
                if (state.pos === undefined)  {
                    createStateVariables(state)
                }
                var pattern = getNextSpecificPattern(state)
                while (pattern) {
                    return pattern
                }
                state.pos = undefined
                --state.h
            }
            state.h = undefined
            --state.p
        }
        if (state.period.min <= 1 && 1 <= state.period.max && state.height.min <= state.b && state.b <= state.height.max) {
            state.p = undefined
            return [state.b--]
        }
        state.p = undefined
        --state.b
    }

    return undefined
}

function createStateVariables(state) {
    state.used  = {}
    state.stack = new Stack()
    state.array = []
    state.pos   = 0
    state.rest  = state.b * state.p
    state.val   = state.h
    state.top   = {
        min: state.h,
        index: -1
    }
    state.i     = state.h
    state.num   = state.h % state.p
    pushScope(state)
}

function getNextSpecificPattern(state) {
    if (state.p === 1 && state.b === state.h) {
        return [balls]
    } else {
        while ((state.i >= state.top.min || state.pos !== 1)) {
            if (state.pos < state.p) {
                if (state.i < state.top.min) {
                    popScope(state)
                } else {
                    state.num = (state.i + state.pos) % state.p
                    if (state.used[state.num] === undefined) {
                        pushScope(state)
                    } else {
                        --state.i
                    }
                }
            } else {
                if (state.top.index === 0) {
                    var pattern = [].concat(state.array)
                    popScope(state)
                    return pattern
                }
                popScope(state)
            }
        }
        return false
    }
}

function pushScope (state) {
    // always state.val >= state.i
    state.top.index = state.val > state.i ? 0 : state.top.index + 1
    state.used[state.num] = true
    state.array.push(state.i)
    state.val = state.array[state.top.index]

    state.rest -= state.i
    ++state.pos

    state.stack.push(state.top)

    if (state.pos < state.p) {
        var n   = state.p - state.pos
        state.i = Math.min(state.val, state.rest)
        var min = state.rest - state.h * (n - 1)
        if (n > 1) min++
        state.top = {
            min: Math.max(min, 0),
            index: state.top.index
        }
    }
}

function popScope(state) {
    state.top = state.stack.pop()

    state.top.index = state.stack.top().index
    state.val = state.array[state.top.index]
    
    --state.pos
    state.rest += state.i = state.array.pop()
    state.num   = (state.i + state.pos) % state.p
    state.used[state.num] = undefined
    --state.i
}

function Stack() {
    this.elems = []
}

Stack.prototype = {
    push: function (e) {
        return this.elems.push(e)
    },
    pop: function () {
        return this.elems.pop()
    },
    top: function () {
        return this.elems[this.elems.length - 1]
    },
}