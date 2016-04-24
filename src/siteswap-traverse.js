var Iterum = require('iterum')
var Range = Iterum.Range
var Value = Iterum.Value
var compose = require('iterum/src/fn/compose')

var siteswapTraverse = function (options) {
    return compose(
        function (_) {
            _(_)
            return new Iterum(Range(options.balls.max, options.balls.min, -1))
        },
        function (balls, _) {
            var max = options.period.max
            var min = Math.max(options.period.min, 1)
            _(balls, _)
            return new Iterum(Range(max, min, -1))
        },
        function (balls, period, _) {
            var max = Math.min(options.height.max, balls * period)
            var min = Math.max(options.height.min, balls + (period > 1 ? 1 : 0))
            _(balls, period, _)
            return new Iterum(Range(max, min, -1))
        },
        function (balls, period, height) {
            return new Iterum(Value([balls, period, height]))
        }
    )()
}

module.exports = siteswapTraverse
