const argv     = require('yargs') .alias('s', 'self') .argv;
const cached   = require('gulp-cached');
const debug    = require('gulp-debug');
const gulp     = require('gulp');
const jsonlint = require('gulp-json-lint');

gulp.task('lint:json', function() {
  
  if (argv.self) {
    src = ['package.json', 'src/config.json'];
   } else {
    src = 'src/config.json';
   }

   gulp.src(src)
  .pipe(cached('lint:json'))
  .pipe(debug())
  .pipe(jsonlint())
  .pipe(jsonlint.report('verbose'));
});