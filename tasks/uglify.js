var
  argv   = require('yargs').alias('s', 'self'),
  cached = require('gulp-cached'),
  concat = require('gulp-concat'),
  debug  = require('gulp-debug'),
  gulp   = require('gulp'),
  queue  = require('streamqueue'),
  uglify = require('gulp-uglify');

gulp.task('make:js', function() {
   console.log('Uglifying Listr JavaScript…');

   return queue({ objectMode: true },
       gulp.src('./src/js/functions.js'),
       gulp.src('./src/js/dropbox.js'),
       gulp.src('./src/js/keyboard.js'),
       gulp.src('./src/js/modal.js'),
       gulp.src('./src/js/search.js'),
       gulp.src('./src/js/table.js'),
       gulp.src('./src/js/init.js')
    )
   .pipe(concat('listr.min.js'))
   .pipe(uglify())
   .pipe(gulp.dest('build/assets/js/'));
 });

gulp.task('make:bootstrap', function() {
   console.log('Uglifying Bootstrap JavaScript…');

   return queue({ objectMode: true },
       // gulp.src('./node_modules/bootstrap/js/src/util.js'),
       gulp.src('./node_modules/bootstrap/js/src/alert.js'),
       gulp.src('./node_modules/bootstrap/js/src/button.js'),
       gulp.src('./node_modules/bootstrap/js/src/dropdown.js'),
       gulp.src('./node_modules/bootstrap/js/src/modal.js')
    )
   .pipe(concat('bootstrap.min.js'))
   // .pipe(uglify())
   .pipe(gulp.dest('build/assets/js/'));
 });
