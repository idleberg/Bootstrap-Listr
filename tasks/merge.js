var
  concat    = require('gulp-concat'),
  concatCss = require('gulp-concat-css'),
  cssmin    = require('gulp-cssmin'),
  del       = require('del'),
  gulp      = require('gulp'),
  jeditor   = require('gulp-json-editor'),
  prompt    = require('gulp-prompt'),
  sequence  = require('run-sequence'),
  queue     = require('streamqueue'),
  uglify    = require('gulp-uglify');

var meta = require('../package.json');

// Merge sequence
gulp.task('merge', function(callback) {

  gulp.src('build/assets')
    .pipe(prompt.prompt({
        type: 'list',
        name: 'merge',
        message: 'Do you want to merge all assets?',
        choices: [
          {
            name: 'Yes, merge all assets',
            value: 'merge'
          },
          'No, keep individual files'
        ]
    }, function(res){
        if(res.merge === 'merge') {
            console.log('Merging assets…');

            sequence(
                  ['merge:js', 'merge:css'],
                  'post-merge',
                  callback
                );

              gulp
              .src("build/config.json")
              .pipe(jeditor({
                'general': {
                  'concat_assets': true
                }
              }))
              .pipe(gulp.dest("build/"));
        }
    }));

});


// Merge JS files
gulp.task('merge:js', function(){

    return queue({ objectMode: true },
       // gulp.src('build/assets/js/bootstrap.min.js'),
       gulp.src('build/assets/js/highlight.min.js'),
       gulp.src('build/assets/js/jquery.searcher.min.js'),
       gulp.src('build/assets/js/stupidtable.min.js'),
       gulp.src('build/assets/js/listr.min.js')
    )
    .pipe(concat('listr.pack.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/assets/js/'));
});


// Merge CSS files
gulp.task('merge:css', function(){

  return gulp.src([
      'build/assets/css/font-awesome.min.css',
      'build/assets/css/bootstrap.min.css',
      'build/assets/css/highlight.min.css',
      'build/assets/css/listr.min.css'
    ])
    .pipe(concatCss('listr.pack.css'))
    .pipe(cssmin())
    .pipe(gulp.dest('build/assets/css/'));
});


// Clean up after merge
gulp.task('post-merge', function() {

  return del([
    'build/assets/css/*.css',
    '!build/assets/css/listr.pack.css',
    'build/assets/js/*.js',
    '!build/assets/js/bootlint.js',
    '!build/assets/js/bootstrap.min.js',
    '!build/assets/js/jquery.min.js',
    '!build/assets/js/listr.pack.js'
  ]);
});