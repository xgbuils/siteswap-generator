(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var siteswapGenerator = require('./siteswap-generator.js')

var generateText = {
    balls: function (text, balls, output) {
    	text.error = false
        if (balls.min !== undefined && balls.max !== undefined
         && balls.min <= balls.max && balls.min > 0) {
            if (balls.min === balls.max) 
                text.balls = 'de ' + balls.max + ' boles'
            else if (balls.min === 1)
                text.balls = 'de màxim ' + balls.max + ' boles'
            else if (balls.min < balls.max)
                text.balls = 'de ' + balls.min + ' a ' + balls.max + ' boles'
        } else {
            text.error = 'L\'interval de boles que demanes no es correcte'
        }
        output.innerHTML = text.balls
    },
    
    period: function (text, period, output) {
    	text.error = false
    	//console.log('eooo')
        if (period.min !== undefined && period.max !== undefined 
         && period.min <= period.max && period.min > 0) {
            if (period.min === period.max) 
                text.period = 'de període ' + period.max
            else if (period.min === 1)
                text.period = 'amb periodes no més grans de ' + period.max
            else if (period.min < period.max)
                text.period = 'amb períodes entre ' + period.min + ' i ' + period.max
        } else {
            text.error = 'L\'interval de períodes que demanes no es correcte'
        }
        output.innerHTML = text.period
    },

    hight: function (text, hight, output) {
    	text.error = false
        if (hight.min === undefined && hight.max === undefined) {
            text.hight = ''
        } else if (hight.min === undefined && hight.max >= 0) {
            text.hight = 'amb llançaments no més alts de ' + hight.max
        } else if (hight.max === undefined && hight.min >= 0) {
            text.hight = 'amb llançaments que continguin alguna alçada major o igual a ' + hight.min
        } else if (hight.min <= hight.max && hight.min >= 0) {
        	if (hight.min === hight.max) {
        		text.hight = 'amb llançaments que continguin alguna alçada de ' + hight.min
        	} else {
                text.hight = 'amb llançaments que continguin alguna alçada major o igual a ' + hight.min + ' i no continguin cap alçada superior a ' + hight.max
            }
        } else {
        	text.error = 'L\'interval de periodes que demanes no es correcte'
        }

        output.innerHTML = text.hight
    }
}

var text = {}
var values = {}
var error = false

document.addEventListener("DOMContentLoaded", function(event) {
    var inputs = {
        balls: {
            min: document.getElementById('balls-min'),
            max: document.getElementById('balls-max')
        },
        period: {
        	min: document.getElementById('period-min'),
            max: document.getElementById('period-max')
        },
        hight: {
        	min:  document.getElementById('hight-min'),
            max:  document.getElementById('hight-max')
        }
    }

    var form = document.getElementById('form')

    var outputs = {
        balls:  document.getElementById('p-balls'),
        period: document.getElementById('p-period'),
        hight:  document.getElementById('p-hight'),
    }

    var message = {
        success: document.getElementById('success'),
        error:   document.getElementById('error')
    }

    console.log(message)

    var div_patterns = document.getElementById('patterns')

    console.log(inputs)

    form.addEventListener('submit', function (event) {
        event.preventDefault()

        var patterns = siteswapGenerator(values.balls, values.period, values.hight)
        console.log(patterns)
        var html = '<ul>\n'
        for (var i = 0; i < patterns.length; ++i) {
            html += '<li>' + patterns[i].join(', ') + '</li>\n'
        }
        html += '</ul>'

        div_patterns.innerHTML = html
    })

    
    for (var key in outputs) {
    	values[key] = {
    		min: parseInt(inputs[key].min.value) || undefined,
            max: parseInt(inputs[key].max.value) || undefined
    	}
    	generateText[key](text, values[key], outputs[key])

    	if (!error && text.error) {
            message.innerHTML = text.error

        }

        ;(function (k) {
        	var callback = function () {
        		values[k] = {
    		        min: parseInt(inputs[k].min.value) || undefined,
                    max: parseInt(inputs[k].max.value) || undefined
    	        }
    	        
                generateText[k](text, values[k], outputs[k])
                if (!error && text.error) {
                	message.success.classList.add('hide')
                	message.error.innerHTML = text.error
                	message.error.classList.remove('hide')
                    error = true
                } else if (error && !text.error) {
                	message.error.classList.add('hide')
                	message.success.classList.remove('hide')
                	error = false
                }
                console.log(text)
            }
            //console.log(inputs[k])
            inputs[k].min.addEventListener('input', callback)
            inputs[k].max.addEventListener('input', callback)
        })(key)
    }

    
});
},{"./siteswap-generator.js":2}],2:[function(require,module,exports){
function copyObject (obj) {
    var o = {}
    for (var key in obj) {
        o[key] = obj[key]
    }
    return o
}

function siteswapGenerator (balls, period, hight) {
    var patterns = []

    if (typeof balls === 'number')
        balls = {max: balls}
    if (balls.min === undefined)
        balls.min = balls.max

    if (typeof period === 'number')
        period = {max: period}
    if (period.min === undefined)
        period.min = 1

    if (hight === undefined)
        hight = {max: period.max * balls.max}
    else if (typeof hight === 'number')
        hight = {max: hight}
    else if (typeof hight.max !== 'number')
        hight.max = period.max * balls.max
    if (hight.min === undefined)
        hight.min = 0

    console.log(balls, period, hight)

    for (var b = balls.max; b >= balls.min; --b) {
        var hightMax, hightMin
        var periodMin = Math.max(period.min, 2)
        for (var p = period.max; p >= periodMin; --p) {
            hightMax = Math.min(hight.max, p * b)
            hightMin = Math.max(hight.min, b + 1)

            for (var h = hightMax; h >= hightMin; --h) {
                specificPatterns(b, p, h, patterns)
            }
        }
        if (period.min <= 1 && 1 <= period.max && hight.min <= b && b <= hight.max)
            patterns.push([b])
    }

    return patterns
}

function specificPatterns(balls, period, top, patterns) {
    if (period === 1 && balls === top) {
        patterns.push([balls])
    } else {
        var used = {}
        used[top % period] = true
        recursive(period, top, used, {
            array : [top],
            index : 0,
            pos   : 1,
            rest  : balls * period - top
        }, patterns)
    }
}

function recursive(period, top, used, pattern, patterns) {
    if (pattern.pos < period) {
        var n   = period - pattern.pos
        var val = pattern.array[pattern.index]

        var max = Math.min(val, pattern.rest)
        var min = pattern.rest - top * (n - 1)
        if (n > 1) min++
        min = Math.max(min, 0)
        for (var i = max; i >= min; --i) {
            var index = val > i ? 0 : pattern.index + 1
            var num = (i + pattern.pos) % period
            if (used[num] === undefined) {
                var newUsed  = copyObject(used)
                newUsed[num] = true
                recursive(period, top, newUsed, {
                    array: pattern.array.concat([i]),
                    index: index,
                    pos:   pattern.pos + 1,
                    rest:  pattern.rest - i
                }, patterns)
            }
        }
    } else {
        if (pattern.index === 0) {
            patterns.push(pattern.array)
        }
    }
}

module.exports = siteswapGenerator
},{}]},{},[1]);
