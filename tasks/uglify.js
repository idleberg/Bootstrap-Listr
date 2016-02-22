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
       gulp.src('functions.js'),
       gulp.src('dropbox.js'),
       gulp.src('keyboard.js'),
       gulp.src('modal.js'),
       gulp.src('search.js'),
       gulp.src('table.js')
    )
   .pipe(concat('listr.min.js'))
   .pipe(uglify())
   .pipe(gulp.dest('build/assets/js/'));
 });