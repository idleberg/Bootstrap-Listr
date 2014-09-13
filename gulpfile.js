var meta = require('./package.json');

var clean   = require('gulp-rimraf');
var concat  = require('gulp-concat');
var csslint = require('gulp-csslint');
var cssmin  = require('gulp-cssmin');
var gulp    = require('gulp');
var jshint  = require('gulp-jshint');
var jeditor = require('gulp-json-editor');
var phplint = require('phplint');
var prompt  = require('gulp-prompt');
var uglify  = require('gulp-uglify');

/*
 * Task combos
 */

gulp.task('lint',   ['csslint', 'jshint', 'phplint']);
gulp.task('make',   ['cssmin', 'uglify']);
gulp.task('travis', ['csslint', 'jshint']);

// Aliases
gulp.task('bscss',       ['theme']);
gulp.task('update',      ['upgrade']);
gulp.task('highlighter', ['hlcss']);

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
 * SETUP
 *
 * All dependencies will be concatenated into a single file
 */
gulp.task('setup', function(){
  var bscss  = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.min.css');
  var bsjs   = gulp.src('./node_modules/bootstrap/dist/js/bootstrap.min.js');
  var bsfont = gulp.src('./node_modules/bootstrap/fonts/*');
  var fa     = gulp.src('./node_modules/font-awesome/css/font-awesome.min.css');
  var fafont = gulp.src('./node_modules/font-awesome/fonts/*');
  var hljs   = gulp.src('./node_modules/highlight.js/lib/highlight.js');
  var jquery = gulp.src(['./node_modules/jquery/dist/jquery.min.js','./node_modules/jquery/dist/jquery.min.map']);
  var search = gulp.src('./node_modules/jquery-searcher/dist/jquery.searcher.min.js');


  gulp.src("./app/config.json")

  .pipe(prompt.prompt({
      type: 'checkbox',
      name: 'bump',
      message: 'Which features do you want to enable?',
      choices: ['Viewer', 'Search Box', 'Font Awesome', 'Highlight.js'],
    }, function(include){

      bscss.pipe(gulp.dest('./app/assets/css/'));
      bsfont.pipe(gulp.dest('./app/assets/fonts/'));

      include.bump.forEach(function(entry) {

          var enable_viewer = false;
          var enable_search = false;
          var icons = 'glyphicons';

          if(entry === 'Viewer') {
            console.log(' +  Viewer included')
            jquery.pipe(gulp.dest('./app/assets/js/'));
            bsjs.pipe(gulp.dest('./app/assets/js/'));
            var enable_viewer = true;
          }
          if(entry === 'Search Box') {
            console.log(' +  Search Box included')
            jquery.pipe(gulp.dest('./app/assets/js/'));
            search.pipe(gulp.dest('./app/assets/js/'));
            var enable_search = true;
          }
          if(entry === 'Font Awesome') {
            console.log(' +  ' + entry + ' included')
            fa.pipe(gulp.dest('./app/assets/css/'));
            fafont.pipe(gulp.dest('./app/assets/fonts/'));
            var icons = 'fontawesome';
          }
          if(entry === 'Highlight.js') {
            console.log(' +  ' + entry + ' included')
            hljs.pipe(concat('./highlight.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('./app/assets/js/'));
          }

          gulp.src("./app/config.json")
          .pipe(jeditor({
            'general': {
              'dependencies': 'local',
              'enable_viewer': true,
              'enable_search': true
            },
            'bootstrap': {
              'icons': icons
            }
          }))
          .pipe(gulp.dest("./app/"));

      })
    }))
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
              console.log(' +  H5BP\'s Apache Server Config')
              gulp.src(['./src/root.htaccess','./node_modules/apache-server-configs/dist/.htaccess'])
              .pipe(concat('.htaccess'))
              .pipe(gulp.dest('./app/'))
        }
        
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
              console.log(' +  Default Bootstrap theme')
              gulp.src('./node_modules/bootstrap/dist/css/bootstrap.min.css')
              .pipe(concat('./bootstrap.min.css'))
              .pipe(gulp.dest('./app/assets/css/')),
              gulp.src("./app/config.json")
                .pipe(jeditor({
                  'bootstrap': {
                    'theme': 'default'
                  }
                }))
                .pipe(gulp.dest("./app/"));
        } else {
              var bootswatch = ['amelia','cerulean','cosmo','cyborg','darkly','flatly','journal','lumen','paper','readable','sandstone','simplex','slate','spacelab','superhero','united','yeti'];

              if (bootswatch.indexOf(res.task) != -1 ) {
                console.log(' +  ' + res.task + ' (Bootswatch)')
                gulp.src('./node_modules/bootswatch/' + res.task + '/bootstrap.min.css')
                .pipe(concat('./bootstrap.min.css'))
                .pipe(gulp.dest('./app/assets/css/')),

                gulp.src("./app/config.json")
                .pipe(jeditor({
                  'bootstrap': {
                    'theme': res.task
                  }
                }))
                .pipe(gulp.dest("./app/"));
              }
        }
    }));
});

/*
 * HIGHLIGHT.JS SETUP
 *
 * Pick a CSS for Highlight.js
 */
gulp.task('hlcss', function(){

 gulp.src('.')
    .pipe(prompt.prompt({
        type: 'input',
        name: 'task',
        message: 'Which Highlight.js theme would you like to use?',
        default: 'default'
    }, function(res){

        var highlighter = ['arta', 'ascetic', 'atelier-dune.dark', 'atelier-dune.light', 'atelier-forest.dark', 'atelier-forest.light', 'atelier-heath.dark', 'atelier-heath.light', 'atelier-lakeside.dark', 'atelier-lakeside.light', 'atelier-seaside.dark', 'atelier-seaside.light', 'brown_paper', 'dark', 'default', 'docco', 'far', 'foundation', 'github', 'googlecode', 'idea', 'ir_black', 'magula', 'mono-blue', 'monokai', 'monokai_sublime', 'obsidian', 'paraiso.dark', 'paraiso.light', 'pojoaque', 'railscasts', 'rainbow', 'school_book', 'solarized_dark', 'solarized_light', 'sunburst', 'tomorrow-night-blue', 'tomorrow-night-bright', 'tomorrow-night-eighties', 'tomorrow-night', 'tomorrow', 'vs', 'xcode', 'zenburn']

        if (highlighter.indexOf(res.task) != -1) {
          gulp.src('./node_modules/highlight.js/styles/' + res.task + '.css')
          .pipe(concat('./highlight.min.css'))
          .pipe(cssmin())
          .pipe(gulp.dest('./app/assets/css/'));

          gulp.src("./app/config.json")
          .pipe(jeditor({
            'highlight': {
              'theme': res.task
            }
          }))
          .pipe(gulp.dest("./app/"));
        }
    }));
});

gulp.task('help', function() {

  console.log('\n' + meta.name + ' v' + meta.version)
  console.log('==================\n')
  console.log('Available tasks:')
  console.log('     help - this dialog')
  console.log('   apache - append H5BP Apache Server Config to default .htaccess')
  console.log('    clean - delete app-folder')
  console.log('    hlcss - specify default Highlighter.js style-sheet')
  console.log('     init - create app-folder and copy required files')
  console.log('     lint - run tasks to lint all CSS, JavaScript and PHP files')
  console.log('     make - minify all CSS and JavaScript files')
  console.log('    reset - reset config.json to default')
  console.log('    setup - configure Bootstrap Listr and copy dependencies')
  console.log('    theme - specify default Bootstrap theme')
  console.log('  upgrade - upgrade all PHP files in app-folder')
  console.log('\nFor further details visit the GitHub repository:')
  console.log('https://github.com/idleberg/Bootstrap-Listr\n')

} )