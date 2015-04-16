function copyObject (obj) {
    var o = {}
    for (var key in obj) {
        o[key] = obj[key]
    }
    return o
}

function isNonNullObject(a) {
    return typeof a === 'object' && a !== null
}

function errorMessage(parameterName, parameterType, expectedTypes) {
    return '`' + parameterName + '` is ' + parameterType 
         + '. Expected ' + expectedTypes.join(' or ') + '.'
}

function checkValidParameter (params, paramName, defaultMinValue, defaultMaxValue) {
    var paramValue = params[paramName]
    var maxValueOK = defaultMaxValue !== undefined
    var minVaLueOK = defaultMinValue !== undefined
    if     (minVaLueOK && maxValueOK && paramValue === undefined) {
        paramValue = {
            max: typeof defaultMaxValue === 'function' ? defaultMaxValue(params) : defaultMaxValue,
            min: typeof defaultMinValue === 'function' ? defaultMinValue(params) : defaultMinValue
        }
    } else {
        if     (typeof paramValue === 'number') {
            params[paramName] = paramValue = { max: paramValue }
        }
        if (isNonNullObject(paramValue)) {
            if (maxValueOK && paramValue.max === undefined) {
                paramValue.max = typeof defaultMaxValue === 'function' ? defaultMaxValue(params) : defaultMaxValue
            } else if (typeof paramValue.max !== 'number') {
                throw new Error(errorMessage(
                    paramName + '.max', 
                    paramValue.max === null ? 'null' : typeof paramValue.max, 
                    ['number']
                ))
            }
            if (paramValue.min === undefined) {
                paramValue.min = typeof defaultMinValue === 'function' ? defaultMinValue(params) : defaultMinValue
            } else if (typeof paramValue.min !== 'number') {
                throw new Error(errorMessage(
                    paramName + '.min', 
                    paramValue.min === null ? 'null' : typeof paramValue.min, 
                    ['number', 'undefined']
                ))
            }
        } else {
            throw new Error(errorMessage(
                paramName, 
                paramValue === null ? 'null' : typeof paramValue, 
                ['number', 'non-null object']
            ))
        }
    }
    return paramValue
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

    return false
}

function siteswapGenerator (balls, period, height) {
    var patterns = []
    var state = {balls: balls, period: period, height: height}

    state.balls  = balls  = checkValidParameter(state, 'balls', function(state) {
        return state.balls.max
    })

    state.period = period = checkValidParameter(state, 'period', 1)

    state.height = height = checkValidParameter(state, 'height', 0, function (state) {
        return state.balls.max * state.period.max
    })

    var heightMax, heightMin, periodMin
    state.b = state.balls.max

    var pattern = getNextPattern(state)
    while (pattern) {
        patterns.push(pattern)
        pattern = getNextPattern(state)
    }

    return patterns
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

module.exports = siteswapGenerator