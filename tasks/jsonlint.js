var
  argv     = require('yargs') .alias('s', 'self') .argv,
  cached   = require('gulp-cached'),
  debug    = require('gulp-debug'),
  gulp     = require('gulp'),
  jsonlint = require('gulp-json-lint');

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