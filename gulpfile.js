var gulp        = require('gulp')
var gutil       = require('gulp-util')
var browserify  = require('browserify')
var browserSync = require('browser-sync')
var nib         = require('nib')
var source      = require('vinyl-source-stream')
var streamify   = require('gulp-streamify')
var stylus      = require('gulp-stylus')
var uglify      = require('gulp-uglify')
var watchify    = require('watchify')

var reload      = browserSync.reload;

/*
 * copy html task
 */
gulp.task('copyhtml', function () {
	gulp.src('./src/gh-pages/index.html', { base: 'src/gh-pages/'})
       .pipe(gulp.dest('./gh-pages/prod/'));
})

/*
 * copy jquery
 */
gulp.task('copyjquery', function() {
  gulp.src('bower_components/jquery/dist/jquery.min.js')
  .pipe(gulp.dest('./gh-pages/prod/js/'));
});

/*
 * stylus task
 */
gulp.task('stylus', function(){
    gulp.src('src/gh-pages/styles/main.styl')
        .pipe(stylus({ use: nib(), compress: true }))
        .pipe(gulp.dest('./gh-pages/prod/styles/'))
        .pipe(reload({ stream: true }))
})

/*
 * js task
 */
var bundler = watchify(browserify('./src/gh-pages/js/main.js', watchify.args));

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
 * serve gh-pages task
 */
gulp.task('serve', [
  'copyhtml',
  'copyjquery',
  'stylus',
  'js' 
  ], function() {
    browserSync({
      server: {
        baseDir: 'gh-pages/prod'
      }
    });
    gulp.watch(['src/gh-pages/index.html'], ['copyhtml']);
    gulp.watch('src/gh-pages/styles/**/*.styl', ['stylus']);
    gulp.watch(['src/**/*.js'], ['js']);

    return bundle()
  }
)



