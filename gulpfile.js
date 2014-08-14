var csslint = require('gulp-csslint');
var gulp    = require('gulp');
var jshint  = require('gulp-jshint');
var phplint = require('phplint');
var prompt  = require('gulp-prompt');
var bower   = require('gulp-bower');

/*
 * Task combos
 */

gulp.task('lint',   ['csslint', 'jshint', 'phplint']);
gulp.task('travis', ['lint']);


/*
 * Sub-tasks
 */

 // PHP Code
gulp.task('phplint', function () {
  return phplint([
        './index.php',
        './listr-config.php-example',
        './listr-functions.php'
    ]);
});

// CSS
gulp.task('csslint', function() {
  gulp.src([
      './src/style.css'
    ])
    .pipe(csslint())
    .pipe(csslint.reporter())
});

// JS
gulp.task('jshint', function() {
  gulp.src([
      './bower.json',
      './config.json',
      './src/scripts.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter())
});

// bower install
gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest('./bower_components'))
});