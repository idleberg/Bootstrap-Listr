var bower   = require('gulp-bower');
var clean   = require('gulp-rimraf');
var concat  = require('gulp-concat');
var csslint = require('gulp-csslint');
var cssmin  = require('gulp-cssmin');
var gulp    = require('gulp');
var jshint  = require('gulp-jshint');
var phplint = require('phplint');
var prompt  = require('gulp-prompt');
var uglify  = require('gulp-uglify');

/*
 * Task combos
 */

gulp.task('lint',   ['csslint', 'jshint', 'phplint']);
gulp.task('make',   ['bower', 'cssmin', 'uglify']);
gulp.task('minify', ['cssmin', 'uglify']);
gulp.task('travis', ['csslint', 'jshint']);

/*
 * SELF COPY
 *
 * Create file structure in app/, copy all PHP & .htaccess
 */
gulp.task('init', ['clean'], function() {

  gulp.src([
      './src/index.php',
      './src/listr-config.php-example',
      './src/listr-functions.php',
      './src/listr-template.php'
    ])
    .pipe(gulp.dest('./app/'));

  gulp.src([
      './src/listr-config.php'
    ])
    .pipe(concat('./listr-config.php-example'))
    .pipe(gulp.dest('./app/'));

  gulp.src([
      './src/root.htaccess'
    ])
    .pipe(concat('./.htaccess'))
    .pipe(gulp.dest('./app/'));

  gulp.src([
      './src/public.htaccess'
    ])
    .pipe(concat('./.htaccess'))
    .pipe(gulp.dest('./app/_public/'));
});

/*
 * CLEAN-UP
 *
 * Delete all files in /app
 */
gulp.task('clean', function () {
  return gulp.src([
      './app/',
      './.tmp/'
    ], {read: false})
    .pipe(clean());
});

/*
 * LINT PHP
 */
gulp.task('phplint', function () {
  return phplint([
        './src/*.php'
    ]);
});

/*
 * LINT CSS
 */
gulp.task('csslint', function() {
  gulp.src([
      './src/style.css'
    ])
    .pipe(csslint())
    .pipe(csslint.reporter())
});

/*
 * MINIFY CSS
 */
gulp.task('cssmin', function() {
  gulp.src([
      './.tmp/bootstrap.css',
      './.tmp/font-awesome.css',
      './.tmp/highlight-theme.css',
      './src/style.css'
    ])
    .pipe(concat('./listr.pack.css'))
    .pipe(cssmin())
    .pipe(gulp.dest('./app/assets/css/'))
});

/*
 * HINT JS
 */
gulp.task('jshint', function() {
  gulp.src([
      './bower.json',
      './src/modal.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter())
});

/*
 * UGLIFY JS
 */
gulp.task('uglify', function() {
  gulp.src([
      './.tmp/bootstrap.js',
      './.tmp/highlight.js',
      './src/modal.js'
    ])
    .pipe(uglify())
    .pipe(concat('./listr.pack.js'))
    .pipe(gulp.dest('./app/assets/js/'))
});

/*
 * BOWER INSTALL
 */
gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest('./bower_components/'))
});

/*
 * SETUP
 *
 * All dependencies will be concatenated into a single file
 */
gulp.task('setup', function(){
  var bscss  = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
  var bsjs   = gulp.src('./node_modules/bootstrap/dist/js/bootstrap.js');
  var bsfont = gulp.src('./node_modules/bootstrap/fonts/*');
  var fa     = gulp.src('./node_modules/font-awesome/css/font-awesome.css');
  var fafont = gulp.src('./node_modules/font-awesome/fonts/*');
  var hljs   = gulp.src('./node_modules/highlight.js/lib/highlight.js');
  var jquery = gulp.src('./node_modules/jquery/dist/jquery.min.js');

  gulp.src([
      '.'
    ])

    .pipe(prompt.prompt({
        type: 'checkbox',
        name: 'bump',
        message: 'Which features do you want to enable?',
        choices: ['Viewer', 'Font Awesome', 'Highlight.js'],
      }, function(include){

        bscss.pipe(gulp.dest('./.tmp/'));
        bsfont.pipe(gulp.dest('./app/assets/fonts/'));

        include.bump.forEach(function(entry) {
            if(entry === 'Viewer') {
              // sources = './node_modules/jquery/dist/jquery.min.js'
              console.log('jQuery and bootstrap.js included')
              jquery.pipe(gulp.dest('./app/assets/js/'));
              bsjs.pipe(gulp.dest('./.tmp/'));
            }
            if(entry === 'Font Awesome') {
              // sources = './node_modules/font-awesome/css/font-awesome.min.css'
              console.log(entry + ' included')
              fa.pipe(gulp.dest('./.tmp/'));
              fafont.pipe(gulp.dest('./app/assets/fonts/'));
            }
            if(entry === 'Highlight.js') {
              // sources = './node_modules/highlight.js/lib/highlight.js'
              console.log(entry + ' included')
              hljs.pipe(gulp.dest('./.tmp/'));
            }
        });
        
    }));
});

/*
 * BOOTSWATCH SETUP
 *
 * Pick a Bootstrap theme
 */
gulp.task('theme', function(){

 gulp.src('.')
    .pipe(prompt.prompt({
        type: 'input',
        name: 'task',
        message: 'Which Bootstrap theme would you like to use?',
        default: 'default'
    }, function(res){

        if(res.task === 'default') {
              console.log(res.task)
              gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css')
              .pipe(concat('./bootstrap.css'))
              .pipe(gulp.dest('./.tmp/'));
        } else {
              var bootswatch = ['amelia','cerulean','cosmo','cyborg','darkly','flatly','journal','lumen','paper','readable','sandstone','simplex','slate','spacelab','superhero','united','yeti'];

              if (bootswatch.indexOf(res.task)) {
                gulp.src('./node_modules/bootswatch/' + res.task + '/bootstrap.min.css')
                .pipe(concat('./bootstrap.css'))
                .pipe(gulp.dest('./.tmp/'));
              }
        }
    }));
});

/*
 * HIGHLIGHT.JS SETUP
 *
 * Pick a CSS for Highlight.js
 */
gulp.task('highlight', function(){

 gulp.src('.')
    .pipe(prompt.prompt({
        type: 'input',
        name: 'task',
        message: 'Which Highlight.js theme would you like to use?',
        default: 'railscasts'
    }, function(res){

        var highlighter = ['arta', 'ascetic', 'atelier-dune.dark', 'atelier-dune.light', 'atelier-forest.dark', 'atelier-forest.light', 'atelier-heath.dark', 'atelier-heath.light', 'atelier-lakeside.dark', 'atelier-lakeside.light', 'atelier-seaside.dark', 'atelier-seaside.light', 'brown_paper', 'dark', 'default', 'docco', 'far', 'foundation', 'github', 'googlecode', 'idea', 'ir_black', 'magula', 'mono-blue', 'monokai', 'monokai_sublime', 'obsidian', 'paraiso.dark', 'paraiso.light', 'pojoaque', 'railscasts', 'rainbow', 'school_book', 'solarized_dark', 'solarized_light', 'sunburst', 'tomorrow-night-blue', 'tomorrow-night-bright', 'tomorrow-night-eighties', 'tomorrow-night', 'tomorrow', 'vs', 'xcode', 'zenburn']

        if (highlighter.indexOf(res.task)) {
          gulp.src('./node_modules/highlight.js/src/themes/' + res.task + '.css')
          .pipe(concat('./highlight-theme.css'))
          .pipe(gulp.dest('./.tmp/'));
        }
    }));
});