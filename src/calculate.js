var Generator = require('./Generator.js')

function calculate (options) {
	var it = Generator(options)
	var values = []
    while (!(state = it.next()).done) {
        values.push(state.value)
    }
    return values
}

module.exports = calculate