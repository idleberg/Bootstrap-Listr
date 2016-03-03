var
  argv   = require('yargs').alias('s', 'self'),
  cached = require('gulp-cached'),
  concat = require('gulp-concat'),
  debug  = require('gulp-debug'),
  gulp   = require('gulp'),
  queue  = require('streamqueue'),
  uglify = require('gulp-uglify');

gulp.task('make:js', function() {
   console.log('Minifying JavaScript…');

   return queue({ objectMode: true },
       gulp.src('./src/js/functions.js'),
       gulp.src('./src/js/dropbox.js'),
       gulp.src('./src/js/keyboard.js'),
       gulp.src('./src/js/modal.js'),
       gulp.src('./src/js/search.js'),
       gulp.src('./src/js/table.js')
    )
   .pipe(concat('listr.min.js'))
   .pipe(uglify())
   .pipe(gulp.dest('build/assets/js/'));
 });