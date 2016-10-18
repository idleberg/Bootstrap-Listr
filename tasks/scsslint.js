const gulp     = require('gulp');
const scsslint = require('gulp-scss-lint');

gulp.task('lint:scss', function() {
  return gulp.src('src/scss/*.scss')
    .pipe(scsslint());
});