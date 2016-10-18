const argv   = require('yargs').alias('f', 'full').argv;
const cached = require('gulp-cached');
const concat = require('gulp-concat');
const cssmin = require('gulp-cssmin');
const gulp   = require('gulp');
const prompt = require('gulp-prompt');
const sass   = require('gulp-sass');

let bootstrap_scss;
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