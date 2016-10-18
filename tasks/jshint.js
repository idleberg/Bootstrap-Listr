const argv   = require('yargs').alias('s', 'self').argv;
const cached = require('gulp-cached');
const debug  = require('gulp-debug');
const gulp   = require('gulp');
const jshint = require('gulp-jshint');

gulp.task('lint:js', function() {

  if (argv.self) {
    src = ['gulpfile.js', 'src/js/*.js'];
  } else {
    src = 'src/js/*.js';
  }

  gulp.src(src)
  .pipe(cached('lint:js'))
  .pipe(debug())
  .pipe(jshint())
  .pipe(jshint.reporter());
});