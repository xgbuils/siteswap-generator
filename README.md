# siteswap-generator

## Siteswap introduction
Siteswap is a juggling notation used to describe or represent juggling patterns. It encodes the number of beats of each throw, which is related to their height, and the hand to which the throw is to be made. However, it does not describe body movements such as behind-the-back and under-the-leg.

A siteswap pattern can be expressed through number sequence that represent a cycle of throws with different heights. These heights must meet certain mathematical rules. For more information, see [siteswap entry](http://en.wikipedia.org/wiki/Siteswap) in wikipedia.

## Description
This module allow to compute the whole patterns with specific number of balls, length of cycle (also called period) and heights. Siteswap generator does not compute patterns that are the same except rotations or repetitions. For example, [5,3,1], [3,1,5] and [1,5,3] are the same except rotations and [3,3,3], [3,3] and [3] are the same except repetitions.

## Installation
``` bash
npm install siteswap-generator
```

## Example:
``` javascript
var siteswap = require('siteswap-generator')

var patterns = siteswap.Generator({
    balls : 3,
    period: {min: 2, max: 3},
    height: 5
})

console.log(patterns)
/*
[ [ 5, 3, 1 ],
  [ 5, 2, 2 ],
  [ 5, 0, 4 ],
  [ 4, 4, 1 ],
  [ 4, 2, 3 ],
  [ 5, 1 ],
  [ 4, 2 ] ]
  */
```

## API

### siteswap === module.exports
Type: Object
#### siteswap.Generator (options)
Type: Function

Returns all of patterns required by `options` object parameter.

##### options.balls
Type: Object | Integer

If `options.balls` is an integer, this is the number of balls of computed patterns.

If `options.balls` is an object, this mean the interval of balls of computed patterns. `options.balls.min` is minimum number of balls of patterns and `options.balls.max` is maximum number of balls. Minimum number of balls is the same that `options.balls.max`.

##### options.period
Type: Object | Integer

If `options.period` is an integer, this is the maximum period of computed patterns. Minimum period is 1 by default.

If `options.period` is an object, this mean the interval periods of patterns. `options.period.min` is minimum period and `options.period.max` is maximum period.

##### options.height
Type: Integer | undefined | Object

If `options.height` is an integer, this mean the maximum height of computed patterns.

If `options.period` is an object:
- `options.height.max` mean that computed patterns have heights less than or equal to this. The default value is `options.balls.max` * `options.period.max`
- `options.height.min` mean that computed patterns have at least one height greater than or equal to this. The default value is 0.

##### Example:
``` javascript
var patterns = siteswap.Generator({
    balls : {min: 1, max: 3},
    period: 3,
    height: {min: 5}
}) /* [ 
  [ 9, 0, 0 ],
  [ 8, 0, 1 ],
  [ 7, 2, 0 ],
  [ 7, 1, 1 ],
  [ 6, 3, 0 ],
  [ 6, 1, 2 ],
  [ 6, 0, 3 ],
  [ 5, 3, 1 ],
  [ 5, 2, 2 ],
  [ 5, 0, 4 ],
  [ 6, 0 ],
  [ 5, 1 ],
  [ 6, 0, 0 ],
  [ 5, 0, 1 ] 
] */
```

#### siteswap.Buffer (options)
Type: function

It is a constructor that creates a buffer object. This allow to get the same patterns than `siteswap.Generator` but these patterns can be get **lazily** with `.slice` method.

##### siteswap.Buffer#slice (begin, end)

It gets slice of patterns generated by `siteswap.Generator` function.

###### begin

Type: Integer

zero-based index at which to begin extraction

###### end

Type: Integer

zero-based index at which to end extraction.

### License
MIT
