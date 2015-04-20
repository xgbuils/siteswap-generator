var Buffer = require('./Buffer.js')

function Generator (options) {
    var buffer = new Buffer(options)
    return buffer.slice(0, Infinity)
}

module.exports = Generator