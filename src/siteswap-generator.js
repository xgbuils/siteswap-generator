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

function siteswapGenerator (balls, period, height) {
    var patterns = []
    var params = {balls: balls, period: period, height: height}

    params.balls  = balls  = checkValidParameter(params, 'balls', function(params) {
        return params.balls.max
    })

    params.period = period = checkValidParameter(params, 'period', 1)

    params.height = height = checkValidParameter(params, 'height', 0, function (params) {
        return params.balls.max * params.period.max
    })

    //console.log(balls, period, height)

    for (var b = balls.max; b >= balls.min; --b) {
        var heightMax, heightMin
        var periodMin = Math.max(period.min, 2)
        for (var p = period.max; p >= periodMin; --p) {
            heightMax = Math.min(height.max, p * b)
            heightMin = Math.max(height.min, b + 1)

            for (var h = heightMax; h >= heightMin; --h) {
                pushSpecificPatterns(b, p, h, patterns)
            }
        }
        if (period.min <= 1 && 1 <= period.max && height.min <= b && b <= height.max)
            patterns.push([b])
    }

    return patterns
}

/*
 * push in `patterns` the sequence of valid patterns with specified number of balls,
 * number of period and at least one throw with `top` height and no highger.
 *
 * @param {number} balls
 * @param {number} period
 * @param {number} top
 * @param {Array}  patterns
 */
function pushSpecificPatterns(balls, period, top, patterns) {
    iterative({
        balls: balls,
        period: period, 
        maxHeight: top,
    }, patterns)
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
    empty: function () {
        return this.elems <= 0
    }
}

function createScope (state) {
    var n   = state.period - state.pos
    state.i = Math.min(state.val, state.rest)
    var min = state.rest - state.maxHeight * (n - 1)
    if (n > 1) min++
    state.top = {
        min: Math.max(min, 0)
    }
}

function popScope(state, array, indexs, stack, used) {
    indexs.pop()
    state.index = indexs[indexs.length - 1]
    state.val   = array[state.index]
    state.top   = stack.pop()
    --state.pos
    state.rest += state.i = array.pop()
    state.num   = (state.i + state.pos) % state.period
    used[state.num] = undefined
    --state.i
}

function iterative(state, patterns) {
    if (state.period === 1 && state.balls === state.maxHeight) {
        patterns.push([balls])
    } else {
        var used   = {}
        used[state.maxHeight % state.period] = true
        var stack  = new Stack()
        var array  = [state.maxHeight]
        var indexs = [0]
        state.pos   = 1
        state.rest  = state.balls * state.period - state.maxHeight
        state.val   = state.maxHeight
        state.index = 0
        state.top   = {}
        
        createScope(state)
        do {
            if (state.pos < state.period) {
                if (state.i < state.top.min) {
                    popScope(state, array, indexs, stack, used)
                } else {
                    state.num = (state.i + state.pos) % state.period
                    if (used[state.num] === undefined) {
                        used[state.num] = true
                        array.push(state.i)
                        // always state.val >= state.i
                        state.index = state.val > state.i ? 0 : state.index + 1
                        indexs.push(state.index)
                        state.val = array[state.index]

                        state.rest -= state.i
                        stack.push(state.top)
                        ++state.pos

                        if (state.pos < state.period) {
                            createScope(state)
                        }
                    } else {
                        --state.i
                    }
                }
            } else {
                if (state.index === 0) {
                    patterns.push([].concat(array))
                }
                popScope(state, array, indexs, stack, used)
            }
        } while ((state.i >= state.top.min || state.pos !== 1))
    }
}

module.exports = siteswapGenerator