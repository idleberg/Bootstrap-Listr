var meta = require('./package.json');

var clean     = require('gulp-rimraf');
var concat    = require('gulp-concat');
var csslint   = require('gulp-csslint');
var cssmin    = require('gulp-cssmin');
var download  = require('gulp-download');
var gulp      = require('gulp');
var jshint    = require('gulp-jshint');
var jeditor   = require('gulp-json-editor');
var phplint   = require('phplint');
var prompt    = require('gulp-prompt');
var uglify    = require('gulp-uglify');

/*
 * Task combos
 */
gulp.task('lint',   ['csslint', 'jshint', 'phplint']);
gulp.task('make',   ['cssmin', 'uglify']);
gulp.task('travis', ['csslint', 'jshint']);

// Task aliases
gulp.task('bs',          ['bootstrap']);
gulp.task('css',         ['csslint', 'cssmin']);
gulp.task('fa',          ['fontawesome']);
gulp.task('hljs',        ['highlighter']);
gulp.task('js',          ['jshint', 'uglify']);
gulp.task('php',         ['phplint']);
gulp.task('update',      ['upgrade']);

/*
 * SELF COPY
 *
 * Create file structure in app/, copy all PHP & .htaccess
 */
gulp.task('init', ['clean'], function() {

  gulp.src([
      './src/index.php',
      './src/listr-functions.php',
      './src/listr-l10n.php',
      './src/listr-template.php'
    ])
    .pipe(gulp.dest('./app/'));

  gulp.src([
      './src/locale/**/*'
    ])
    .pipe(gulp.dest('./app/locale/'));

  gulp.src([
      './src/config.json'
    ])
    .pipe(concat('./config.json'))
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
 * UPGRADE
 *
 * Upgrade files in app/. Does not touch config.json and .htaccess files!
 */
gulp.task('upgrade', function() {

  gulp.src([
      './src/index.php',
      './src/listr-functions.php',
      './src/listr-l10n.php',
      './src/listr-template.php'
    ])
    .pipe(gulp.dest('./app/'));

  gulp.src([
      './src/config.json'
    ])
    .pipe(concat('./config.json-example'))
    .pipe(gulp.dest('./app/'));

  gulp.src([
      './src/locale/**/*'
    ])
    .pipe(gulp.dest('./app/locale/'));
});

/*
 * CLEAN-UP
 *
 * Delete all files in /app
 */
gulp.task('clean', function () {
  return gulp.src([
      './app/',
    ], {read: false})
    .pipe(clean());
});

gulp.task('download', function () {
  download('http://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.2/highlight.min.js')
  .pipe(gulp.dest("./app/"));
});

gulp.task('reset', function () {
  gulp.src([
      './src/config.json'
    ])
    .pipe(gulp.dest('./app/'));
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
      './src/style.css'
    ])
    .pipe(concat('./listr.min.css'))
    .pipe(cssmin())
    .pipe(gulp.dest('./app/assets/css/'))
});

/*
 * HINT JS
 */
gulp.task('jshint', function() {
  gulp.src([
      './src/scripts.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter())
});

/*
 * UGLIFY JS
 */
gulp.task('uglify', function() {
  gulp.src([
      './src/scripts.js'
    ])
    .pipe(uglify())
    .pipe(concat('./listr.min.js'))
    .pipe(gulp.dest('./app/assets/js/'))
});

/*
 * BOOTSTRAP THEME SETUP
 *
 * Pick a Bootstrap theme
 */
gulp.task('bootstrap', function(){

 gulp.src('.')
    .pipe(prompt.prompt({
        type: 'input',
        name: 'bootstrap',
        message: 'Which Bootstrap theme would you like to use?',
        default: 'default'
    }, function(res){

        var bootswatch = ['amelia','cerulean','cosmo','cyborg','darkly','flatly','journal','lumen','paper','readable','sandstone','simplex','slate','spacelab','superhero','united','yeti'];

        if(res.bootstrap === 'default') {
              console.log(' +  default Bootstrap theme')
              gulp.src('./node_modules/bootstrap/dist/css/bootstrap.min.css')
              .pipe(concat('./bootstrap.min.css'))
              .pipe(gulp.dest('./app/assets/css/'))
              gulp.src("./app/config.json")
                .pipe(jeditor({
                  'bootstrap': {
                    'theme': 'default'
                  }
                }))
                .pipe(gulp.dest("./app/"));
        } else if (bootswatch.indexOf(res.bootstrap) != -1 ) {
              console.log(' +  ' + res.bootstrap + ' (Bootswatch)')
              gulp.src('./node_modules/bootswatch/' + res.bootstrap + '/bootstrap.min.css')
              .pipe(concat('./bootstrap.min.css'))
              .pipe(gulp.dest('./app/assets/css/')),

              gulp.src("./app/config.json")
              .pipe(jeditor({
                'bootstrap': {
                  'theme': res.bootstrap
                }
              }))
              .pipe(gulp.dest("./app/"));
        } else {
          console.warn(' -  Error: theme not supported')
        }
    }));
});

/*
 * VIEWER SETUP
 *
 * Copy dependencies for the viewer modal
 */
gulp.task('viewer', function(){

  gulp.src('.')

    .pipe(prompt.prompt({
        type: 'input',
        name: 'viewer',
        message: 'Do you want to make use of the viewer modal?',
        default: 'y'
      }, function(res){
        if(res.viewer === 'y') {
              console.log(' +  Viewer included')
              gulp.src([
                './node_modules/bootstrap/dist/js/bootstrap.min.js',
                './node_modules/jquery/dist/jquery.min.js',
                './node_modules/jquery/dist/jquery.min.map'
              ])
              .pipe(gulp.dest('./app/assets/js/'));

              gulp.src("./app/config.json")
              .pipe(jeditor({
                'general': {
                  'enable_viewer': true
                }
              }))
              .pipe(gulp.dest("./app/"));
        } else {
          console.log(' -  Viewer skipped')
        }
    }));
});

/*
 * SEARCH BOX SETUP
 *
 * Copy dependencies for the search box
 */
gulp.task('search', function(){

  gulp.src('.')

    .pipe(prompt.prompt({
        type: 'input',
        name: 'search',
        message: 'Do you want to make use of the search box?',
        default: 'y'
      }, function(res){
        if(res.search === 'y') {
              console.log(' +  Search Box included')
              gulp.src([
                './node_modules/jquery/dist/jquery.min.js',
                './node_modules/jquery/dist/jquery.min.map',
                './node_modules/jquery-searcher/dist/jquery.searcher.min.js'

              ])
              .pipe(gulp.dest('./app/assets/js/'))

              gulp.src("./app/config.json")
              .pipe(jeditor({
                'general': {
                  'enable_search': true
                }
              }))
              .pipe(gulp.dest("./app/"));
        } else {
          console.log(' -  Search Box skipped')
        }
    }));
});

/*
 * FONT AWESOME SETUP
 *
 * Copy dependencies for Font Awesome icons
 */
gulp.task('icons', function(){

  gulp.src('.')

    .pipe(prompt.prompt({
        type: 'input',
        name: 'fontawesome',
        message: 'Do you want to make use of Font Awesome icons?',
        default: 'y'
      }, function(res){
        if(res.fontawesome === 'y') {
              console.log(' +  Font Awesome included')

              gulp.src([
                './node_modules/font-awesome/css/font-awesome.min.css'

              ])
              .pipe(gulp.dest('./app/assets/css/'))

              gulp.src([
                './node_modules/font-awesome/fonts/*'

              ])
              .pipe(gulp.dest('./app/assets/fonts/'))

              gulp.src("./app/config.json")
              .pipe(jeditor({
                'bootstrap': {
                  'icons': 'fontawesome'
                }
              }))
              .pipe(gulp.dest("./app/"));
        } else {
          console.log(' -  Font Awesome skipped')
        }
    }));
});

/*
 * HIGHLIGHT.JS SETUP
 *
 * Copy dependencies for the syntax highlighter
 */
gulp.task('highlighter', function(){

  gulp.src('.')

    .pipe(prompt.prompt({
        type: 'input',
        name: 'hljs',
        message: 'Do you want to make use of the syntax highlighter?',
        default: 'y'
      }, function(res){
        if(res.hljs === 'y') {
              download('http://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.2/highlight.min.js')
              .pipe(gulp.dest('./app/assets/js/'))
              download('http://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.2/styles/default.min.css')
              .pipe(concat('./highlight.min.css'))
              .pipe(gulp.dest('./app/assets/css/'));
              console.log(' +  Highlight.js included (use "gulp theme" to pick a different theme')
        } else {
          console.log(' -  Highlight.js skipped')
        }
    }));
});

/*
 * APACHE SERVER CONFIGS
 *
 * Append HTML5 Boilerplate's Apache rules to .htaccess
 */
gulp.task('apache', function(){

  gulp.src([
      './src/root.htaccess'
    ])

    .pipe(prompt.prompt({
        type: 'input',
        name: 'h5bp',
        message: 'Do you want to append H5BP\'s Apache Server Config rules?',
        default: 'y'
      }, function(res){
        if(res.h5bp === 'y') {
              console.log(' +  H5BP\'s Apache Server Config appended')
              gulp.src(['./src/root.htaccess','./node_modules/apache-server-configs/dist/.htaccess'])
              .pipe(concat('.htaccess'))
              .pipe(gulp.dest('./app/'))
        } else {
          console.log(' -  H5BP\'s Apache Server Config skipped')
        }
    }));
});

/*
 * HIGHLIGHT.JS THEME
 *
 * Pick a style-sheet for Highlight.js
 */
gulp.task('theme', function(){

 gulp.src('.')
    .pipe(prompt.prompt({
        type: 'input',
        name: 'hljs_theme',
        message: 'Which Highlight.js theme would you like to use?',
        default: 'default'
    }, function(res){

        var highlighter = ['arta', 'ascetic', 'atelier-dune.dark', 'atelier-dune.light', 'atelier-forest.dark', 'atelier-forest.light', 'atelier-heath.dark', 'atelier-heath.light', 'atelier-lakeside.dark', 'atelier-lakeside.light', 'atelier-seaside.dark', 'atelier-seaside.light', 'brown_paper', 'dark', 'default', 'docco', 'far', 'foundation', 'github', 'googlecode', 'idea', 'ir_black', 'magula', 'mono-blue', 'monokai', 'monokai_sublime', 'obsidian', 'paraiso.dark', 'paraiso.light', 'pojoaque', 'railscasts', 'rainbow', 'school_book', 'solarized_dark', 'solarized_light', 'sunburst', 'tomorrow-night-blue', 'tomorrow-night-bright', 'tomorrow-night-eighties', 'tomorrow-night', 'tomorrow', 'vs', 'xcode', 'zenburn']

        if (highlighter.indexOf(res.hljs_theme) != -1) {
          download('http://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.2/styles/' + res.hljs_theme + '.min.css')
          .pipe(concat('./highlight.min.css'))
          .pipe(gulp.dest('./app/assets/css/'));

          gulp.src("./app/config.json")
          .pipe(jeditor({
            'highlight': {
              'theme': res.hljs_theme
            }
          }))
          .pipe(gulp.dest("./app/"));
        } else {
          console.warn(' -  Error: theme not supported')
        }
    }));
});

gulp.task('help', function() {

  console.log('\n' + meta.name + ' v' + meta.version)
  console.log('==================\n')
  console.log('Available tasks:')
  console.log('        help - this dialog')
  console.log('      apache - append H5BP Apache Server Config to default .htaccess')
  console.log('   bootstrap - specify default Bootstrap theme')
  console.log('       clean - delete app-folder')
  console.log(' fontawesome - include Font Awesome icons')
  console.log('        hljs - include Highlight.js')
  console.log('        init - create app-folder and copy required files')
  console.log('        lint - run tasks to lint all CSS, JavaScript and PHP files')
  console.log('        make - minify all CSS and JavaScript files')
  console.log('       reset - reset config.json to default')
  console.log('      search - include scripts for Search Box')
  console.log('       theme - specify default Highlighter.js style-sheet')
  console.log('     upgrade - upgrade all PHP files in app-folder')
  console.log('      viewer - include scripts for Viewer modal')
  console.log('\nFor further details visit the GitHub repository:')
  console.log('https://github.com/idleberg/Bootstrap-Listr\n')

} )