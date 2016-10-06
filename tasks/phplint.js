const gulp    = require('gulp');
const phplint = require('phplint').lint;

gulp.task('lint:php', function(cb) {
  phplint(['src/*.php'], {limit: 10}, function (err, stdout, stderr) {
    if (err) {
      cb(err);
      process.exit(1);
    }
    cb();
  });
});