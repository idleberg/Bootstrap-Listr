const gulp  = require('gulp');
const watch = require('gulp-watch');

// Watch task
gulp.task('watch', function () {
   gulp.watch([
          'gulpfile.js',
          'package.json',
          'src/config.json',
          'src/js/*.js',
          'src/css/*.css'
         ],
         ['lint']
   );
});

// Watch JS
gulp.task('watch:js', function () {
   gulp.watch([
            'src/js/*.js'
         ],
         ['uglify']);
});

// Watch CSS
gulp.task('watch:scss', function () {
   gulp.watch([
            'src/scss/*.scss'
         ],
         ['scssmin']);
});