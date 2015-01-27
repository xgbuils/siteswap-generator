var siteswapGenerator = require('../src/siteswap-generator')

var args = process.argv.slice(2, 5).map(function (arg) {
    var arr = arg.split(':')
    return arr.length === 1 ? parseInt(arr[0]) : {
        min: arr[0] ? parseInt(arr[0]) : undefined,
        max: arr[1] ? parseInt(arr[1]) : undefined
    }
})

var patterns = siteswapGenerator.apply(null, args)
console.log(patterns)