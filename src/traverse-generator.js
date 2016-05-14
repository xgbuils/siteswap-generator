var Iterum = require('iterum')
var Range = Iterum.Range
var Value = Iterum.Value

var siteswapTraverse = function (options) {
    return Iterum.compose(
        function (_) {
            _(_)
            return Iterum(Range(options.balls.max, options.balls.min, -1)).build()()
        },
        function (balls, _) {
            var max = options.period.max
            var min = Math.max(options.period.min, 1)
            _(balls, _)
            return Iterum(Range(max, min, -1)).build()()
        },
        function (balls, period, _) {
            var max = Math.min(options.height.max, balls * period)
            var min = Math.max(options.height.min, balls + (period > 1 ? 1 : 0))
            _(balls, period, _)
            return Iterum(Range(max, min, -1)).build()()
        },
        function (balls, period, height) {
            return Iterum(Value([balls, period, height])).build()()
        }
    )()
}

module.exports = siteswapTraverse
