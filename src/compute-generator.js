var Iterum = require('iterum')
var compose = Iterum.compose
var Empty = Iterum.Empty
var Range = Iterum.Range
var Value = Iterum.Value

function computeGenerator (balls, period, height) {
    var args = [
        beginningGeneratorCreator(balls, period, height, 0)
    ]
    var length = period - 1
    for (var index = 1; index < length; ++index) {
        args.push(middleGeneratorCreator(balls, period, height, index))
    }
    args.push(endGeneratorCreator(balls, period, height, length))
    return compose.apply(null, args)()
}

function beginningGeneratorCreator (balls, period, height) {
    return function (_) {
        var mod = (height + index) % period
        var options = {
            rest: balls * period - height,
            used: {},
            pattern: [height]
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
            return Iterum(Empty()).build()()
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
        var generator
        if (index === 0) {
            generator = Value([].concat(options.pattern))
        } else if (options.used[mod]) {
            generator = Empty()
        } else {
            updateOptions(options, mod, h)
            pointer = options.pattern[pointer] > h ? 0 : pointer + 1
            if (pointer === 0) {
                generator = Value([].concat(options.pattern))
            } else {
                generator = Empty()
            }
        }
        return Iterum(generator).build()()
    }
}

function rebuildOptions (options, period, index) {
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
    return Iterum(Range(maxHeight, minHeight, -1)).build()()
}

module.exports = computeGenerator
