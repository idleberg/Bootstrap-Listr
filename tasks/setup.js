const argv     = require('yargs').alias('d', 'debug').argv;
const concat   = require('gulp-concat');
const cssmin   = require('gulp-cssmin');
const debug    = require('gulp-debug');
const gulp     = require('gulp');
const jeditor  = require('gulp-json-editor');
const prompt   = require('gulp-prompt');
const sequence = require('run-sequence');
const uglify   = require('gulp-uglify');
const meta     = require('../package.json');

// Setup sequence
gulp.task('setup', function(callback) {

  sequence(
      'depends',
      'select',
      callback
    );
});


// Specify default asset location
gulp.task('depends', function() {
  return gulp.src('./')
    .pipe(prompt.prompt({
        type: 'list',
        name: 'dependencies',
        message: 'Choose how to load app dependencies',
        choices: [
          {
            name: 'From your server',
            value: 'local'
          },
          {
            name: 'Use content delivery networks (CDN)',
            value: 'cdn'
          }
      ]
    }, function(res){
        let assets;

        if (res.dependencies === 'local') {

          assets = {
            'general': {
                'local_assets': true
            },
            'assets': {
                'jquery_js': "assets/js/jquery.min.js",
                'jquery_map': "assets/js/jquery.min.map",
                'jquery_searcher': "assets/js/jquery.searcher.min.js",
                'bootstrap_css': "assets/css/bootstrap.min.css",
                'bootstrap_js': "assets/js/bootstrap.min.js",
                'font_awesome': "assets/css/font-awesome.min.css",
                'stupid_table': "assets/js/stupidtable.min.js",
                'highlight_js': "assets/js/highlight.min.js",
                'highlight_css': "assets/css/highlight.min.css",
                'bootlint': "assets/js/bootlint.min.js"
              }
            };

        } else {

              // Read src/config.json
              let config = require('../src/config.json');

              assets =  {
                'general': {
                    'local_assets': false
                },
                'assets': {
                  'jquery_js': config.assets.jquery_js,
                  'jquery_map': config.assets.jquery_map,
                  'jquery_searcher': config.assets.jquery_searcher,
                  'bootstrap_css': config.assets.bootstrap_css,
                  'bootstrap_js': config.assets.bootstrap_js,
                  'font_awesome': config.assets.font_awesome,
                  'stupid_table': config.assets.stupid_table,
                  'highlight_js': config.assets.highlight_js,
                  'highlight_css': config.assets.highlight_css, //.replace('%theme%', config.highlight.theme),
                  'bootlint': config.assets.bootlint
                }
              };
        }

        gulp.src("build/config.json")
        .pipe(jeditor(
          assets
        ))
        .pipe(gulp.dest("build/"));
    }));
});


// Feature selection
gulp.task('select', function(callback){

  // Set defaults
  let enable_viewer      = false;
  let enable_search      = false;
  let enable_highlight   = false;
  let default_icons      = 'fa';
  let include_bootlint   = false;

  // check debug features
  if (argv.debug) {
    debug_check = true;
  } else {
    debug_check = false;
  }

  let features = [
        { name: 'Viewer Modal', value: 'viewer' , checked: true },
        { name: 'Search Box', value: 'search' , checked: true },
        { name: 'Syntax Highlighter', value: 'highlighter' , checked: true },
        { name: 'H5BP Apache Server Config', value: 'htaccess' , checked: true },
        { name: 'robots.txt', value: 'robots' , checked: true },
        { name: 'DEBUG: Bootlint', value: 'bootlint' ,checked: debug_check },
        { name: 'DEBUG: jQuery Source Map', value: 'jquery_map', checked: debug_check }
      ];

  // uncheck all features
  if (argv.minimum) {
    for (let i = 0; i < 6; i++) {
       features[i].checked =  false;
    }
  }

  if (argv.full) {
    bootstrap_js = 'node_modules/bootstrap/build/js/bootstrap.js';
  } else {
    bootstrap_js = [
      'node_modules/bootstrap/js/umd/alert.js',
      'node_modules/bootstrap/js/umd/util.js',
      'node_modules/bootstrap/js/umd/dropdown.js',
      'node_modules/bootstrap/js/umd/modal.js'
    ];
  }

  // Setup dialog
  return gulp.src('./')
    .pipe(prompt.prompt({
        type: 'checkbox',
        name: 'feature',
        message: 'Which features would you like to use?',
        choices: features,
      }, function(res){

        tasks = [];

        // Enable search box
        if (res.feature.indexOf('search') > -1 ) {
          console.info('Including search box assets…');
          
          gulp
            .src([
              'node_modules/jquery-searcher/build/jquery.searcher.min.js'
             ])
            .pipe(gulp.dest('build/assets/js/'));

          enable_search = true;
        } 

        // Enable Viewer Modal modal
        if (res.feature.indexOf('viewer') > -1) {
          console.log('Compiling Bootstrap scripts…');

          gulp
            .src(bootstrap_js)
            .pipe(concat('bootstrap.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('build/assets/js/'));

          enable_viewer = true;
        }

        // Include syntax highlighter
         if (res.feature.indexOf('highlighter') > -1) {
          console.log('Including syntax highlighter assets…');
 
          gulp
            .src('node_modules/highlight.js/build/highlight.pack.js')
            .pipe(concat('highlight.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('build/assets/js/'));

          enable_highlight = true;

          gulp
            .src([
              'node_modules/highlight.js/src/styles/github.css'
            ])
            .pipe(concat('highlight.min.css'))
            .pipe(cssmin())
            .pipe(gulp.dest('build/assets/css/'));

            gulp.start('select:highlighter');
        }

        // Set default icons to Font Awesome
        if (res.feature.indexOf('font_awesome') > -1) {
          console.log('Including Font Awesome assets…');

          gulp
            .src('node_modules/font-awesome/css/font-awesome.min.css')
            .pipe(gulp.dest('build/assets/css/'));

          gulp
            .src('node_modules/font-awesome/fonts/fontawesome-webfont.*')
            .pipe(gulp.dest('build/assets/fonts/'));

          default_icons = 'fontawesome';
        }

        // Include H5BP Apache Config
        if (res.feature.indexOf('htaccess') > -1) {
          console.log('Appending H5BP Apache server configuration…');

          gulp
            .src([
              'src/root.htaccess',
              'node_modules/apache-server-configs/dist/.htaccess'
              ])
            .pipe(concat('.htaccess'))
            .pipe(gulp.dest('build/'));
        }

        // Include robots.txt 
        if (res.feature.indexOf('robots') > -1) {
          console.log('Including robots.txt…');

          gulp
            .src('src/robots.txt')
            .pipe(gulp.dest('build/'));
        }

        // Include Bootlint for debugging
        if (res.feature.indexOf('bootlint') > -1) {

          gulp
            .src('node_modules/bootlint/build/browser/bootlint.js')
            .pipe(gulp.dest('build/assets/js/'));

          include_bootlint = true;
        }

        // Include jQuery map for debugging
        if (res.feature.indexOf('jquery_map') > -1) {

          gulp
            .src([
              'node_modules/jquery/build/jquery.min.js',
              'node_modules/jquery/build/jquery.min.map'
            ])
            .pipe(gulp.dest('build/assets/js/'));
        }

        // Write settings to config.json
        gulp.src("build/config.json")
            .pipe(jeditor({
              'general': {
                'enable_search': enable_search,
                'enable_viewer': enable_viewer,
                'enable_highlight': enable_highlight
              },
              'bootstrap': {
                'icons': default_icons
              },
              'debug': {
                'bootlint': include_bootlint
              }
            }))
            .pipe(gulp.dest("build/"));
        
    }));
});