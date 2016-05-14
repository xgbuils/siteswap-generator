var gulp        = require('gulp')
var gulpif      = require('gulp-if')
var gutil       = require('gulp-util')
var browserify  = require('browserify')
var browserSync = require('browser-sync')
var nib         = require('nib')
var source      = require('vinyl-source-stream')
var streamify   = require('gulp-streamify')
var stylus      = require('gulp-stylus')
var uglify      = require('gulp-uglify')
var watchify    = require('watchify')
var mocha       = require('gulp-mocha');
var eslint = require('gulp-eslint')

var reload      = browserSync.reload
var taskName    = process.argv[2]

/*
 * copy html task
 */
gulp.task('copyhtml', function () {
	gulp.src('./src/gh-pages/index.html', { base: 'src/gh-pages/'})
       .pipe(gulp.dest('./gh-pages/prod/'))
       .pipe(gulpif(taskName === 'serve', reload({ stream: true })))
})

/*
 * copy jquery task
 */
gulp.task('copyjquery', function() {
  gulp.src('bower_components/jquery/dist/jquery.min.js')
  .pipe(gulp.dest('./gh-pages/prod/js/'))
});

/*
 * copy fonts task
 */
gulp.task('copyfonts', function() {
  gulp.src('src/gh-pages/fonts/**/*')
  .pipe(gulp.dest('./gh-pages/prod/fonts/'))
  .pipe(gulpif(taskName === 'serve', reload({ stream: true })))
});

/*
 * stylus task
 */
gulp.task('stylus', function(){
    gulp.src('src/gh-pages/styles/main.styl')
        .pipe(stylus({ use: nib(), compress: true }))
        .pipe(gulp.dest('./gh-pages/prod/styles/'))
        .pipe(gulpif(taskName === 'serve', reload({ stream: true })))
})

/*
 * js task
 */
var bundler = browserify('./src/gh-pages/js/main.js', watchify.args)

function bundle() {
  console.log('bundle')
  return bundler.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('main.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('gh-pages/prod/js'))
}

gulp.task('js', bundle)
bundler.on('update', bundle);

/*
 * build task
 */
gulp.task('build', [
  'copyhtml',
  'copyfonts',
  'copyjquery',
  'stylus',
  'js' 
])

/*
 * serve gh-pages task
 */
gulp.task('serve', ['build'], function() {
  browserSync({
    server: {
      baseDir: 'gh-pages/prod'
    }
  });
  gulp.watch(['src/gh-pages/index.html'], ['copyhtml']);
  gulp.watch('src/gh-pages/styles/**/*.styl', ['stylus']);
  gulp.watch(['src/**/*.js'], ['js']);

  return bundle()
})

/*
 * test task
 */
gulp.task('test', function() {
  return gulp.src('test/**/*_test.js', {read: false})
    .pipe(mocha())
})

gulp.task('lint', function () {
    return gulp.src(['./**/*.js', '!./test/input/**/*.js', '!./test/output/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
})