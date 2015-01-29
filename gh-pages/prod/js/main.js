(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var siteswapGenerator = require('../../siteswap-generator.js')
var scrollTo = require('./scrollTo.js')

var generateText = {
    balls: function (text, balls, $output) {
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
        $output.text(text.balls)
    },
    
    period: function (text, period, $output) {
        text.error = false
        console.log('eooo', text.error)
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
        $output.text(text.period)
    },

    height: function (text, height, $output) {
        text.error = false
        if (height.min === undefined && height.max === undefined) {
            text.height = ''
        } else if (height.min === undefined && height.max >= 0) {
            text.height = 'amb llançaments no més alts de ' + height.max
        } else if (height.max === undefined && height.min >= 0) {
            text.height = 'amb llançaments que continguin alguna alçada major o igual a ' + height.min
        } else if (height.min <= height.max && height.min >= 0) {
            if (height.min === height.max) {
                text.height = 'amb llançaments que continguin alguna alçada de ' + height.min + ' i no més alta'
            } else {
                text.height = 'amb llançaments que continguin alguna alçada major o igual a ' + height.min + ' i no continguin cap alçada superior a ' + height.max
            }
        } else {
            text.error = 'L\'interval de periodes que demanes no es correcte'
        }

        $output.text(text.height)
    }
}

var text = {}
var values = {}
var error = false
var heightToLetter = "0123456789abcdefghijklmnopqrstuvxyz"

$(document).ready(function (event) {
    var inputs = {
        balls: {
            min: $('#balls-min'),
            max: $('#balls-max')
        },
        period: {
            min: $('#period-min'),
            max: $('#period-max')
        },
        height: {
            min:  $('#height-min'),
            max:  $('#height-max')
        }
    }

    var $form = $('#form')
    var $root = $('body, html')

    var outputs = {
        balls:  $('#p-balls'),
        period: $('#p-period'),
        height:  $('#p-height'),
    }

    var message = {
        $success: $('#success'),
        $error:   $('#error')
    }

    var $patterns = $('#patterns')

    $form.on('submit', function (event) {
        event.preventDefault()

        var patterns = siteswapGenerator(values.balls, values.period, values.height)
        var html = '<ul>\n'
        for (var i = 0; i < patterns.length; ++i) {
            html += '<li>'
            html += patterns[i].map(function (e) {
                return heightToLetter[e]
            }).join('')
            html += '</li>\n'
        }
        html += '</ul>'

        var top = $patterns.offset().top
        console.log($(window).height())
        $patterns.css('height', 'auto')
        $patterns.css('min-height', $(window).height())

        $root.animate({scrollTop: top}, '500', 'swing', function() { 
            //alert("Finished animating");
        });

        $patterns.html(html)
    })

    $form.on('input', 'input[type=number]', function () {
        var key = $(this).data('type')
        values[key] = {
            min: parseInt(inputs[key].min.val()) || undefined,
            max: parseInt(inputs[key].max.val()) || undefined
        }
        generateText[key](text, values[key], outputs[key])
        console.log('error:', error)
        console.log('text.error:', text.error)
        if (!error && text.error) {
            message.$success.addClass('hide')
            message.$error.text(text.error)
            message.$error.removeClass('hide')
            error = true
        } else if (error && !text.error) {
            message.$error.addClass('hide')
            message.$success.removeClass('hide')
            error = false
        }
        console.log(text)
        /*div_patterns.style.height = '0px'
        div_patterns.style.minHeight = '0px'*/
    })

    
    for (var key in outputs) {
        values[key] = {
            min: parseInt(inputs[key].min.val()) || undefined,
            max: parseInt(inputs[key].max.val()) || undefined
        }
        generateText[key](text, values[key], outputs[key])

        if (!error && text.error) {
            message.$error(text.error)
        }
    }
})
},{"../../siteswap-generator.js":3,"./scrollTo.js":2}],2:[function(require,module,exports){
module.exports = function scrollTo(element, to, duration) {
    var start = element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;
        
    var animateScroll = function(){        
        currentTime += increment;
        var val = Math.easeInOutQuad(currentTime, start, change, duration);
        window.scroll(0, val);
        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
}

//t = current time
//b = start value
//c = change in value
//d = duration
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};
},{}],3:[function(require,module,exports){
function copyObject (obj) {
    var o = {}
    for (var key in obj) {
        o[key] = obj[key]
    }
    return o
}

function siteswapGenerator (balls, period, height) {
    var patterns = []

    if (typeof balls === 'number')
        balls = {max: balls}
    if (balls.min === undefined)
        balls.min = balls.max

    if (typeof period === 'number')
        period = {max: period}
    if (period.min === undefined)
        period.min = 1

    if (height === undefined)
        height = {max: period.max * balls.max}
    else if (typeof height === 'number')
        height = {max: height}
    else if (typeof height.max !== 'number')
        height.max = period.max * balls.max
    if (height.min === undefined)
        height.min = 0

    console.log(balls, period, height)

    for (var b = balls.max; b >= balls.min; --b) {
        var heightMax, heightMin
        var periodMin = Math.max(period.min, 2)
        for (var p = period.max; p >= periodMin; --p) {
            heightMax = Math.min(height.max, p * b)
            heightMin = Math.max(height.min, b + 1)

            for (var h = heightMax; h >= heightMin; --h) {
                specificPatterns(b, p, h, patterns)
            }
        }
        if (period.min <= 1 && 1 <= period.max && height.min <= b && b <= height.max)
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
