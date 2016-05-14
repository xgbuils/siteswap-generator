var _ = require('./utils.js')
var PARAM_NAMES = require('./conf/PARAM_NAMES')
var DEFAULT_VALUES = require('./conf/DEFAULT_VALUES')
var traverseGenerator = require('./traverse-generator.js')
var computeGenerator = require('./compute-generator.js')
var Iterum = require('iterum')
var compose = Iterum.compose

function Generator(options) {
    var opts = {}
    _.transformParams.call(opts, options || {}, PARAM_NAMES)
    _.each(PARAM_NAMES, function (name, i) {
        _.setDefaultValues.call(opts, name, 'max', DEFAULT_VALUES[i])
        _.setDefaultValues.call(opts, name, 'min', DEFAULT_VALUES[i])
    }, opts)

    return compose(
        function (_) {
            _(_)
            return traverseGenerator(opts)
        },
        function (e) {
            return computeGenerator.apply(null, e)
        }
    )()
}

module.exports = Generator
