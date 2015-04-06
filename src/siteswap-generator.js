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
    if (period === 1 && balls === top) {
        patterns.push([balls])
    } else {
        var used = {}
        used[top % period] = true
        recursive(period, top, used, {
            array : [top],
            index : 0,
            pos   : 1,
            rest  : balls * period - top
        }, patterns)
    }
}

function recursive(period, top, used, pattern, patterns) {
    if (pattern.pos < period) {
        var n   = period - pattern.pos
        var val = pattern.array[pattern.index]

        var max = Math.min(val, pattern.rest)
        var min = pattern.rest - top * (n - 1)
        if (n > 1) min++
        min = Math.max(min, 0)
        for (var i = max; i >= min; --i) {
            var index = val > i ? 0 : pattern.index + 1
            var num = (i + pattern.pos) % period
            if (used[num] === undefined) {
                var newUsed  = copyObject(used)
                newUsed[num] = true
                recursive(period, top, newUsed, {
                    array: pattern.array.concat([i]),
                    index: index,
                    pos:   pattern.pos + 1,
                    rest:  pattern.rest - i
                }, patterns)
            }
        }
    } else {
        if (pattern.index === 0) {
            patterns.push(pattern.array)
        }
    }
}

module.exports = siteswapGenerator