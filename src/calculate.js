var Generator = require('./Generator.js')

function calculate (options) {
    var generator = new Generator(options)
    return generator.slice(0, Infinity)
}

module.exports = calculate