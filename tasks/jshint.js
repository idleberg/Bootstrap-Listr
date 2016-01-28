var
  argv   = require('yargs').alias('s', 'self').argv,
  cached = require('gulp-cached'),
  debug  = require('gulp-debug'),
  gulp   = require('gulp'),
  jshint = require('gulp-jshint');

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