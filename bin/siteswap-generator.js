#! /usr/bin/env node

var siteswap = require('../index.js')

var properties = ['balls', 'period', 'height']
var args       = process.argv.slice(2, 5)
var options    = {}

for (var i = 0; i < properties.length; ++i) {
    options[properties[i]] = convertArg(args[i])
}

var patterns = siteswap.Generator(options)
console.log(patterns)

function convertArg (arg) {
    var arr = arg.split(':')
    if        (arr.length === 1) {
        return {max: parseInt(arr[0])}
    } else if (arr.length === 2) {
        return {
            min: arr[0] ? parseInt(arr[0]) : undefined,
            max: arr[1] ? parseInt(arr[1]) : undefined
        }
    }
}
