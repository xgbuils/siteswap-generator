module.exports = [{
    min: function () {
        return this.balls.max
    }
}, {
    max: function () {
        return this.balls.max
    },
    min: 1
}, {
    max: function () {
        return this.balls.max * this.period.max
    },
    min: 0
}]
