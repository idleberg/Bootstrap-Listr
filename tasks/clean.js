const del  = require('del');
const gulp = require('gulp');

// Clean dist folder
gulp.task('clean', function () {
  console.log('Cleaning up…\n')
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