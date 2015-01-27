function copyObject (obj) {
    var o = {}
    for (var key in obj) {
        o[key] = obj[key]
    }
    return o
}

function siteswapGenerator (balls, period, hight) {
    var patterns = []

    if (typeof balls === 'number')
        balls = {max: balls}
    if (balls.min === undefined)
        balls.min = balls.max

    if (typeof period === 'number')
        period = {max: period}
    if (period.min === undefined)
        period.min = 1

    if (hight === undefined)
        hight = {max: period.max * balls.max}
    else if (typeof hight === 'number')
        hight = {max: hight}
    else if (typeof hight.max !== 'number')
        hight.max = period.max * balls.max
    if (hight.min === undefined)
        hight.min = 0

    console.log(balls, period, hight)

    for (var b = balls.max; b >= balls.min; --b) {
        var hightMax, hightMin
        var periodMin = Math.max(period.min, 2)
        for (var p = period.max; p >= periodMin; --p) {
            hightMax = Math.min(hight.max, p * b)
            hightMin = Math.max(hight.min, b + 1)

            for (var h = hightMax; h >= hightMin; --h) {
                specificPatterns(b, p, h, patterns)
            }
        }
        if (period.min <= 1 && 1 <= period.max && hight.min <= b && b <= hight.max)
            patterns.push([b])
    }

    return patterns
}

function specificPatterns(balls, period, top, patterns) {
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