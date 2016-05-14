var Generator = require('./Generator.js')
var Iterum = require('iterum')

function calculate (options) {
	return Iterum(Generator, options).toArray()
}

module.exports = calculate