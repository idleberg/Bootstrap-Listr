var
  del  = require('del'),
  gulp = require('gulp');

// Clean dist folder
gulp.task('clean', function () {
  console.log('Cleaning up…')
  return del([
    './build/'
  ]);
});

gulp.task('clean:pack', function () {

  return del([
    'build/assets/css/listr.pack.css',
    'build/assets/js/listr.pack.js'
  ]);
});