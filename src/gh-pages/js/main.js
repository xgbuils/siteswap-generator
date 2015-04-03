var siteswapGenerator = require('../../siteswap-generator.js')

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