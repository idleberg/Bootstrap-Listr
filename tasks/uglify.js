var
  argv   = require('yargs').alias('s', 'self'),
  cached = require('gulp-cached'),
  concat = require('gulp-concat'),
  debug  = require('gulp-debug'),
  gulp   = require('gulp'),
  order  = require('gulp-order'),
  uglify = require('gulp-uglify');

gulp.task('make:js', function() {
   console.log('Minifying JavaScript…');

   gulp.src([
     'src/js/*.js'
   ])
   .pipe(cached('uglify'))
   .pipe(order([
       'functions.js',
       'dropbox.js',
       'keyboard.js',
       'modal.js',
       'search.js',
       'table.js'
   ], { base: './src/js/' }))
   .pipe(concat('listr.min.js'))
   .pipe(uglify())
   .pipe(gulp.dest('build/assets/js/'));
 });