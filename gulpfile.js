var gulp        = require('gulp')
var mocha       = require('gulp-mocha');
var eslint = require('gulp-eslint')

/*
 * test task
 */
gulp.task('test', function() {
  return gulp.src('test/**/*_test.js', {read: false})
    .pipe(mocha())
})

/*
 * lint task
 */
gulp.task('lint', function () {
    return gulp.src(['./**/*.js', '!./test/input/**/*.js', '!./test/output/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
})