var isObject = require('is-object')

function each (array, cb, context) {
    var n = array.length
    for (var i = 0; i < n; ++i) {
        cb.call(context, array[i], i, array)
    }
}

var _ = {}

each(['Function', 'Number'], function (name) {
    _['is' + name] = function (obj) {
        return toString.call(obj) === '[object ' + name + ']'
    }
})

var isNumber = _.isNumber

function transformParams (params, paramNames) {
    each(paramNames, function (name) {
        var value = params[name]
        var ref = this[name] = {}
        if (isNumber(value)) {
            ref.max = value
        } else if (isObject(value)) {
            each(['max', 'min'], function (key) {
                var val = value[key]
                if (isNumber(val)) {
                    ref[key] = val
                }
            })
        }
    }, this)
}

function setDefaultValues (paramName, key, defaults, error) {
    var ref = this[paramName]
    if (ref[key] === undefined) {
        var defaultValue = defaults[key]
        if (isNumber(defaultValue)) {
            ref[key] = defaultValue
        } else if (_.isFunction(defaultValue)) {
            ref[key] = defaultValue.call(this)
        } else {
            throw new Error(error(paramName, key))
        }
    }
}

module.exports = {
    transformParams: transformParams,
    setDefaultValues: setDefaultValues,
    each: each
}
