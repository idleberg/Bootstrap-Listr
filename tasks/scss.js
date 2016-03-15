var
  argv    = require('yargs').alias('f', 'full').argv,
  cached  = require('gulp-cached'),
  concat  = require('gulp-concat'),
  cssmin  = require('gulp-cssmin'),
  gulp    = require('gulp'),
  prompt  = require('gulp-prompt'),
  sass    = require('gulp-sass');

var bootstrap_scss;
if (argv.full) {
  bootstrap_scss = 'node_modules/bootstrap/scss/bootstrap.scss';
} else {
  bootstrap_scss = 'src/scss/bootstrap-listr.scss';
}

// Select Bootstrap theme
gulp.task('make:scss', function(){
  
  gulp.src(bootstrap_scss)
  .pipe(cached('make:scss'))
  .pipe(sass().on('error', sass.logError))
  .pipe(concat('bootstrap.min.css'))
  .pipe(cssmin())
  .pipe(gulp.dest('build/assets/css/'));

  gulp.src([
    'src/scss/basic.scss',
    'src/scss/modal.scss',
    'src/scss/table.scss'
    // 'src/scss/github-markdown.scss'
    ])
  .pipe(sass().on('error', sass.logError))
  .pipe(concat('listr.min.css'))
  .pipe(cssmin())
  .pipe(gulp.dest('build/assets/css/'));

});