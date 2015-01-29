#siteswap generator

siteswap info: http://en.wikipedia.org/wiki/Siteswap

script for finding vanilla juggling patterns given a range of balls, periods and heights.

##Install
``` bash
npm install siteswap-generator
```

##Use bash script:
``` bash
node bin/siteswap-generator.js [minBalls:]maxBalls [minPeriod:]maxPeriod [minHeight:]maxHeight
```

###sample:
``` bash
node bin/siteswap-generator.js 3 2:3 5
[ [ 5, 3, 1 ],
  [ 5, 2, 2 ],
  [ 5, 0, 4 ],
  [ 4, 4, 1 ],
  [ 4, 2, 3 ],
  [ 5, 1 ],
  [ 4, 2 ] ]
```

##Use for node:
``` bash
node bin/siteswap-generator.js [minBalls:]maxBalls [minPeriod:]maxPeriod [minHeight:]maxHeight
```

###sample:
``` javascript
var siteswapGenerator = require('siteswap-generator')

var patterns = siteswapGenerator(3, {
	min: 2,
	max: 3
}, 5)

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
