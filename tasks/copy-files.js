var
  concat    = require('gulp-concat'),
  gulp      = require('gulp');

gulp.task('copy', ['copy:config', 'copy:css', 'copy:fonts', 'copy:htaccess', 'copy:js', 'copy:l10n', 'copy:php', 'copy:themes']);

// Copy PHP
gulp.task('copy:php', function() {

  gulp.src([
    './src/index.php',
    './src/listr-functions.php',
    './src/listr-l10n.php',
    './src/listr-template.php'
    ])
  .pipe(gulp.dest('build/'));

});

// Copy Parsedown
gulp.task('copy:php-parsedown', function() {

  gulp.src([
    './src/parsedown/Parsedown.php',
    ])
  .pipe(gulp.dest('build/parsedown'));

});

// Copy localization files
gulp.task('copy:l10n', function() {

  gulp.src([
   './src/l10n/**/*'
   ])
  .pipe(gulp.dest('build/l10n/'));

});

// Copy icon themes
gulp.task('copy:themes', function() {

  gulp.src([
    './src/themes/*.json'
    ])
  .pipe(gulp.dest('build/themes/'));

});

// Copy config.json
gulp.task('copy:config', function() {

  gulp.src([
    'src/config.json'
    ])
  .pipe(gulp.dest('build/'));

});

// Copy .htaccess files
gulp.task('copy:htaccess', function() {

  gulp.src([
    'src/root.htaccess',
    'node_modules/apache-server-configs/build/.htaccess'
    ])
  .pipe(concat('.htaccess'))
  .pipe(gulp.dest('build/'));

  gulp.src([
    'src/public.htaccess'
    ])
  .pipe(concat('.htaccess'))
  .pipe(gulp.dest('build/_public/'));

});

// Copy JavaScript
gulp.task('copy:js', ['make:js'], function() {

  gulp.src([
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'node_modules/highlight.js/dist/highlight.min.js',
    'node_modules/jquery-stupid-table/stupidtable.min.js',
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/jquery-searcher/dist/jquery.searcher.min.js'
    ])
  .pipe(gulp.dest('build/assets/js/'));

  gulp.src([
    'node_modules/highlight.js/build/highlight.pack.js',
    ])
  .pipe(concat('highlight.min.js'))
  .pipe(gulp.dest('build/assets/js/'));

});

// Copy style-sheets
gulp.task('copy:css', ['make:scss'], function() {
  gulp.src([
    'node_modules/font-awesome/css/font-awesome.min.css'
  ])
  .pipe(gulp.dest('build/assets/css/'));

  gulp.src('node_modules/highlight.js/src/styles/github.css')
  .pipe(concat('highlight.min.css'))
  .pipe(gulp.dest('build/assets/css/'));

});
// Copy Font Awesome
gulp.task('copy:fonts', function() {

  gulp.src('node_modules/font-awesome/fonts/fontawesome-webfont.*')
  .pipe(gulp.dest('build/assets/fonts/'));

});