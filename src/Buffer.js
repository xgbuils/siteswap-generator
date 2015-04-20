var LazyArray           = require('lazyarray-lite')
var checkValidParameter = require('./utils.js').checkValidParameter

function Buffer(options) {
    if (!(this instanceof Buffer)) {
        return new Buffer(options)
    }
    this.patterns = new LazyArray({
        init: function () {
            this.balls  = options.balls
            this.period = options.period
            this.height = options.height
            initialize.call(this)
        },
        next: function () {
            return getNextPattern(this)
        }
    })
}

Buffer.prototype.slice = function (begin, end) {
    return this.patterns.slice(begin, end)
}

module.exports = Buffer

function initialize () {
    this.balls  = checkValidParameter(this, 'balls', function(self) {
        return self.balls.max
    })

    this.period = checkValidParameter(this, 'period', 1)

    this.height = checkValidParameter(this, 'height', 0, function (self) {
        return self.balls.max * self.period.max
    })

    this.b = this.balls.max
}

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