//                    _       __    __         
//  _   ______ ______(_)___ _/ /_  / /__  _____
// | | / / __ `/ ___/ / __ `/ __ \/ / _ \/ ___/
// | |/ / /_/ / /  / / /_/ / /_/ / /  __(__  ) 
// |___/\__,_/_/  /_/\__,_/_.___/_/\___/____/  
                                            

// Read package.json metadata
var meta     = require('./package.json');

// Highlighter.js Styles
var hjs = [];


// A handy repeat function
  var repeat = function (s, n, d) {
    return --n ? s + (d || "") + repeat(s, n, d) : "" + s;
  };


// Gulp plugins
var console   = require('better-console'),
    cache     = require('gulp-cached'),
    concat    = require('gulp-concat'),
    concatCss = require('gulp-concat-css'),
    csslint   = require('gulp-csslint'),
    cssmin    = require('gulp-cssmin'),
    debug     = require('gulp-debug'),
    del       = require('del'),
    fs        = require('fs'),
    // gettext   = require('gulp-gettext'),
    gulp      = require('gulp'),
    insert    = require('gulp-insert'),
    jeditor   = require('gulp-json-editor'),
    jshint    = require('gulp-jshint'),
    jsonlint  = require('gulp-json-lint'),
    less      = require('gulp-less'),
    notify    = require("gulp-notify"),
    path      = require('path'),
    phplint   = require('phplint').lint,
    prompt    = require('gulp-prompt'),
    sequence  = require('run-sequence'),
    uglify    = require('gulp-uglify'),
    watch     = require('gulp-watch'),
    argv      = require('yargs')
                .alias('b',   'bootstrap')
                .alias('d',   'debug')
                .alias('m',   'minimum')
                .alias('min', 'minimum')
                .alias('s',   'self')
                .argv;

//    __             __      __       _                           
//   / /_____ ______/ /__   / /______(_)___ _____ ____  __________
//  / __/ __ `/ ___/ //_/  / __/ ___/ / __ `/ __ `/ _ \/ ___/ ___/
// / /_/ /_/ (__  ) ,<    / /_/ /  / / /_/ / /_/ /  __/ /  (__  ) 
// \__/\__,_/____/_/|_|   \__/_/  /_/\__, /\__, /\___/_/  /____/  
//                                  /____//____/                  

// Task combos
gulp.task('lint',      ['csslint', 'jshint', 'jsonlint', 'phplint']);
gulp.task('css',       ['csslint', 'cssmin']);
gulp.task('debug',     ['bootlint','jquery']);
gulp.task('js',        ['jshint',  'uglify']);
gulp.task('make',      ['cssmin',  'uglify']);
gulp.task('php',       ['phplint']);
gulp.task('travis',    ['csslint', 'jshint']);


// Task aliases
gulp.task('bootswatch', ['swatch']);
gulp.task('cleansetup', ['setup-clean']);
gulp.task('deps',       ['depends']);
gulp.task('jsmin',      ['uglify']);
gulp.task('minify',     ['make']);
gulp.task('setupclean', ['setup-clean']);
gulp.task('update',     ['upgrade']);
  

//               __                 __             __       
//    ________  / /___  ______     / /_____ ______/ /_______
//   / ___/ _ \/ __/ / / / __ \   / __/ __ `/ ___/ //_/ ___/
//  (__  )  __/ /_/ /_/ / /_/ /  / /_/ /_/ (__  ) ,< (__  ) 
// /____/\___/\__/\__,_/ .___/   \__/\__,_/____/_/|_/____/  
//                    /_/                                   

// Default task
gulp.task('default', function (callback) {
  setTimeout(function() {

    console.clear();
    console.log('\n' + meta.name + ' v' + meta.version);
    console.log('The MIT License (MIT)');

    if ( !fs.existsSync('./dist/config.json') ) {
      console.log('\nRunning setup…');
      tasks = [
        'init',
        'setup'
      ];
    } else {
      console.log('\nConfiguration file detected\nRunning upgrade…');
      tasks = [
        'upgrade'
      ];
    }

    sequence(
      tasks, callback
    );

  }, 50);
});


// Setup sequence
gulp.task('setup', function(callback) {

  sequence(
      'depends',
      'bootswatch',
      'select',
      'make',
      callback
    );
});


gulp.task('setup-clean', ['clean'], function(callback) {   
   
  gulp.start('default');   
});


// Feature selection
gulp.task('select', function(callback){

  // Set defaults
  var enable_viewer      = false,
      enable_search      = false;
      enable_highlight   = false;
      default_icons      = 'glyphicons';
      include_bootlint   = false;

  // check debug features
  if (argv.debug) {
    debug_check = true;
  } else {
    debug_check = false;
  }

  var features = [
        { name: 'Viewer Modal', value: 'viewer' , checked: true },
        { name: 'Search Box', value: 'search' , checked: true },
        { name: 'Syntax Highlighter', value: 'highlighter' , checked: true },
        { name: 'Font Awesome', value: 'font_awesome' , checked: true },
        { name: 'H5BP Apache Server Config', value: 'htaccess' , checked: true },
        { name: 'robots.txt', value: 'robots' , checked: true },
        { name: 'DEBUG: Bootlint', value: 'bootlint' ,checked: debug_check },
        { name: 'DEBUG: jQuery Source Map', value: 'jquery_map', checked: debug_check }
      ];

  // uncheck all features
  if (argv.minimum) {
    for (var i = 0; i < 6; i++) {
       features[i].checked =  false;
    }
  }

  if (argv.bootstrap) {
    bootstrap_js = 'node_modules/bootstrap/dist/js/bootstrap.js';
  } else {
    bootstrap_js = [
      'node_modules/bootstrap/js/transition.js',
      'node_modules/bootstrap/js/dropdown.js',
      'node_modules/bootstrap/js/modal.js'
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
              'node_modules/jquery-searcher/dist/jquery.searcher.min.js'
             ])
            .pipe(gulp.dest('dist/assets/js/'));

          enable_search = true;
        } 


        // Enable Viewer Modal modal
        if (res.feature.indexOf('viewer') > -1) {
          console.log('Compiling Bootstrap scripts…');

          gulp
            .src(bootstrap_js)
            .pipe(concat('bootstrap.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('dist/assets/js/'));

          enable_viewer = true;
        }


        // Include syntax highlighter
         if (res.feature.indexOf('highlighter') > -1) {
          console.log('Including syntax highlighter assets…');
 
          gulp
            // .src('node_modules/highlight.js/build/highlight.pack.js')
            .src('node_modules/highlightjs/highlight.pack.js')
            .pipe(concat('highlight.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('dist/assets/js/'));

          enable_highlight = true;

          gulp
            .src([
              // 'node_modules/highlight.js/src/styles/github.css'
              'node_modules/highlightjs/styles/github.css'
            ])
            .pipe(concat('highlight.min.css'))
            .pipe(cssmin())
            .pipe(gulp.dest('dist/assets/css/'));

            gulp.start('hjs');
        }

        // Set default icons to Font Awesome
        if (res.feature.indexOf('font_awesome') > -1) {
          console.log('Including Font Awesome assets…');

          gulp
            .src('node_modules/font-awesome/css/font-awesome.min.css')
            .pipe(gulp.dest('dist/assets/css/'));

          gulp
            .src('node_modules/font-awesome/fonts/fontawesome-webfont.*')
            .pipe(gulp.dest('dist/assets/fonts/'));

          del([
              'dist/assets/fonts/glyphicons-halflings-regular.*'
            ]);

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
            .pipe(gulp.dest('dist/'));
        }


        // Include robots.txt 
        if (res.feature.indexOf('robots') > -1) {
          console.log('Including robots.txt…');

          gulp
            .src('src/robots.txt')
            .pipe(gulp.dest('dist/'));
        }


        // Include Bootlint for debugging
        if (res.feature.indexOf('bootlint') > -1) {

          gulp
            .src('node_modules/bootlint/dist/browser/bootlint.js')
            .pipe(gulp.dest('dist/assets/js/'));

          include_bootlint = true;
        }


        // Include Bootlint for debugging
        if (res.feature.indexOf('jquery_map') > -1) {


          gulp
            .src([
              'node_modules/jquery/dist/jquery.min.js',
              'node_modules/jquery/dist/jquery.min.map'
            ])
            .pipe(gulp.dest('dist/assets/js/'));
        }


        // Write settings to config.json
        gulp.src("dist/config.json")
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
            .pipe(gulp.dest("dist/"));
        
    }));
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
        
        var assets;

        
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
                'bootswatch_css': "assets/css/bootstrap.min.css",
                'font_awesome': "assets/css/font-awesome.min.css",
                'm8tro_css': "assets/css/bootstrap.min.css",
                'stupid_table': "assets/js/stupidtable.min.js",
                'highlight_js': "assets/js/highlight.min.js",
                'highlight_css': "assets/css/highlight.min.css",
                'bootlint': "assets/js/bootlint.min.js"
              }
            };

        } else {

              // Read src/config.json
              var config = require('./src/config.json');

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
                  'bootswatch_css': config.assets.bootswatch_css, //.replace('%theme%', config.bootstrap.theme),
                  'font_awesome': config.assets.font_awesome,
                  'm8tro_css': config.assets.m8tro_css,
                  'stupid_table': config.assets.stupid_table,
                  'highlight_js': config.assets.highlight_js,
                  'highlight_css': config.assets.highlight_css, //.replace('%theme%', config.highlight.theme),
                  'bootlint': config.assets.bootlint
                }
              };
        }

        gulp.src("dist/config.json")
        .pipe(jeditor(
          assets
        ))
        .pipe(gulp.dest("dist/"));
    }));
});

// Select Bootstrap theme
gulp.task('swatch', function(){

  var themes     = ['(default)', 'M8tro'],
      bootstrap_less = [],
      less_dir       = 'node_modules/bootstrap/less/';

  // Get Bootswatch themes
  var bootswatch = require('./node_modules/bootswatch/api/3.json');
  bootswatch.themes.forEach(function(entry) {
    themes.push(entry.name);
  });
  
  themes.sort();

  bootstrap_less.push(less_dir+'variables.less');

  // Mixins
  bootstrap_less.push(less_dir+'mixins/hide-text.less');
  bootstrap_less.push(less_dir+'mixins/opacity.less');
  bootstrap_less.push(less_dir+'mixins/image.less');
  bootstrap_less.push(less_dir+'mixins/labels.less');
  bootstrap_less.push(less_dir+'mixins/reset-filter.less');
  bootstrap_less.push(less_dir+'mixins/resize.less');
  bootstrap_less.push(less_dir+'mixins/responsive-visibility.less');
  bootstrap_less.push(less_dir+'mixins/size.less');
  bootstrap_less.push(less_dir+'mixins/tab-focus.less');
  bootstrap_less.push(less_dir+'mixins/reset-text.less');
  bootstrap_less.push(less_dir+'mixins/text-emphasis.less');
  bootstrap_less.push(less_dir+'mixins/text-overflow.less');
  bootstrap_less.push(less_dir+'mixins/vendor-prefixes.less');

  if (argv.bootstrap) bootstrap_less.push(less_dir+'mixins/alerts.less');
  bootstrap_less.push(less_dir+'mixins/buttons.less');
  if (argv.bootstrap) bootstrap_less.push(less_dir+'mixins/panels.less');
  if (argv.bootstrap) bootstrap_less.push(less_dir+'mixins/pagination.less');
  if (argv.bootstrap) bootstrap_less.push(less_dir+'mixins/list-group.less');
  bootstrap_less.push(less_dir+'mixins/nav-divider.less');
  bootstrap_less.push(less_dir+'mixins/forms.less');
  if (argv.bootstrap) bootstrap_less.push(less_dir+'mixins/progress-bar.less');
  bootstrap_less.push(less_dir+'mixins/table-row.less');
  bootstrap_less.push(less_dir+'mixins/background-variant.less');
  bootstrap_less.push(less_dir+'mixins/border-radius.less');
  bootstrap_less.push(less_dir+'mixins/gradients.less');
  bootstrap_less.push(less_dir+'mixins/clearfix.less');
  bootstrap_less.push(less_dir+'mixins/center-block.less');
  if (argv.bootstrap) bootstrap_less.push(less_dir+'mixins/nav-vertical-align.less');
  bootstrap_less.push(less_dir+'mixins/grid-framework.less');
  bootstrap_less.push(less_dir+'mixins/grid.less');

  bootstrap_less.push(less_dir+'normalize.less');
  if (argv.bootstrap) bootstrap_less.push(less_dir+'print.less');
  bootstrap_less.push(less_dir+'glyphicons.less');
  bootstrap_less.push(less_dir+'scaffolding.less');
  bootstrap_less.push(less_dir+'type.less');
  bootstrap_less.push(less_dir+'code.less');
  bootstrap_less.push(less_dir+'grid.less');
  bootstrap_less.push(less_dir+'tables.less');
  bootstrap_less.push(less_dir+'forms.less');
  bootstrap_less.push(less_dir+'buttons.less');
  bootstrap_less.push(less_dir+'component-animations.less');
  bootstrap_less.push(less_dir+'dropdowns.less');
  bootstrap_less.push(less_dir+'button-groups.less');
  if (argv.bootstrap) bootstrap_less.push(less_dir+'input-groups.less');
  if (argv.bootstrap) bootstrap_less.push(less_dir+'navs.less');
  if (argv.bootstrap) bootstrap_less.push(less_dir+'navbar.less');
  bootstrap_less.push(less_dir+'breadcrumbs.less');
  if (argv.bootstrap) bootstrap_less.push(less_dir+'pagination.less');
  if (argv.bootstrap) bootstrap_less.push(less_dir+'pager.less');
  if (argv.bootstrap) bootstrap_less.push(less_dir+'labels.less');
  if (argv.bootstrap) bootstrap_less.push(less_dir+'badges.less');
  if (argv.bootstrap) bootstrap_less.push(less_dir+'jumbotron.less');
  if (argv.bootstrap) bootstrap_less.push(less_dir+'thumbnails.less');
  if (argv.bootstrap) bootstrap_less.push(less_dir+'alerts.less');
  if (argv.bootstrap) bootstrap_less.push(less_dir+'progress-bars.less');
  if (argv.bootstrap) bootstrap_less.push(less_dir+'media.less');
  if (argv.bootstrap) bootstrap_less.push(less_dir+'list-group.less');
  if (argv.bootstrap) bootstrap_less.push(less_dir+'panels.less');
  bootstrap_less.push(less_dir+'responsive-embed.less');
  if (argv.bootstrap) bootstrap_less.push(less_dir+'wells.less');
  bootstrap_less.push(less_dir+'close.less');
  bootstrap_less.push(less_dir+'modals.less');
  if (argv.bootstrap) bootstrap_less.push(less_dir+'tooltip.less');
  if (argv.bootstrap) bootstrap_less.push(less_dir+'popovers.less');
  if (argv.bootstrap) bootstrap_less.push(less_dir+'carousel.less');
  bootstrap_less.push(less_dir+'utilities.less');
  bootstrap_less.push(less_dir+'responsive-utilities.less');
      
  return gulp.src('./')
    .pipe(prompt.prompt({
        type: 'list',
        name: 'theme',
        message: 'Choose a Bootstrap theme',
        choices: themes,
      }, function(res){

          // Copy glyphicons
          gulp
            .src('node_modules/bootstrap/fonts/*')
            .pipe(gulp.dest('dist/assets/fonts/'));

          // Set default theme
          if (res.theme === '(default)') {
              
              console.log('Compiling default Bootstrap theme…');

              gulp.src(bootstrap_less)
              .pipe(concat('bootstrap.less'))
              .pipe(less({
                paths: [ path.join(__dirname, 'less', 'includes') ]
              }))
              .pipe(concat('bootstrap.min.css'))
              .pipe(cssmin())
              .pipe(gulp.dest('dist/assets/css/'));
              
              gulp.src("dist/config.json")
              .pipe(jeditor({
                'bootstrap': {
                  'theme': 'default'
                }
              }))
              .pipe(gulp.dest("dist/"));

          // Set M8tro theme (http://idleberg.github.io/m8tro-bootstrap/)
          } else if (res.theme === 'm8tro') {

            slug = res.theme.toLowerCase();

            console.log('Compiling Bootstrap theme “M8tro”');

            bootstrap_less.push('node_modules/m8tro-bootstrap/src/themes/m8tro/palette.less');
            bootstrap_less.push('node_modules/m8tro-bootstrap/src/themes/m8tro/variables.less');
            bootstrap_less.push('node_modules/m8tro-bootstrap/src/themes/m8tro/theme.less');

            gulp.src(bootstrap_less)
            .pipe(concat('bootstrap.less'))
            .pipe(less({
              paths: [ path.join(__dirname, 'less', 'includes') ]
            }))
            .pipe(concat('bootstrap.min.css'))
            .pipe(cssmin())
            .pipe(gulp.dest('dist/assets/css/'));
            
            gulp.src("dist/config.json")
            .pipe(jeditor({
              'bootstrap': {
                'theme': slug
              }
            }))
            .pipe(gulp.dest("dist/"));

          // Set Bootswatch theme
          } else {

            slug = res.theme.toLowerCase();
            
            console.log('Compiling Bootswatch theme “'+res.theme+'”…');

            bootstrap_less.push('node_modules/bootswatch/' + slug + '/variables.less');
            bootstrap_less.push('node_modules/bootswatch/' + slug + '/bootswatch.less');

            gulp.src(bootstrap_less)
            .pipe(concat('bootstrap.less'))
            .pipe(less({
              paths: [ path.join(__dirname, 'less', 'includes') ]
            }))
            .pipe(concat('bootstrap.min.css'))
            .pipe(cssmin())
            .pipe(gulp.dest('dist/assets/css/'));

            gulp.src("dist/config.json")
            .pipe(jeditor({
              'bootstrap': {
                'theme': slug
              }
            }))
            .pipe(gulp.dest("dist/"));
          }
    }));
});

function getBasename(file) {
  if(file.substr(file.lastIndexOf('.')+1) == 'css') {
    hjs.push( file.substring(0, file.lastIndexOf(".")) );
  }
}

// Choose a highlight.js theme
gulp.task('hjs', function(){

  // css = fs.readdirSync('./node_modules/highlight.js/src/styles/');
  css = fs.readdirSync('./node_modules/highlightjs/styles/');
  css.forEach(getBasename);

  hjs.sort();
  hjs.concat(hjs.splice(0,hjs.indexOf('github')));

  return gulp.src('./')
   .pipe(prompt.prompt({
       type: 'list',
       name: 'theme',
       message: 'Choose a highlight.js theme',
       choices: hjs,
     }, function(res){

        // var source_dir = 'node_modules/highlight.js/src/styles/';
        var source_dir = 'node_modules/highlightjs/styles/';

         // Set default theme
         console.log('Minifying highlight.js theme “'+res.theme+'”…');
         gulp.src(source_dir+res.theme+'.css')
         .pipe(concat('highlight.min.css'))
         .pipe(cssmin())
         .pipe(gulp.dest('dist/assets/css/'));

         gulp.src("dist/config.json")
         .pipe(jeditor({
           'highlight': {
             'theme': res.theme
           // },
           // 'assets': {
           //    'highlight_css': config.assets.highlight_css.replace('%theme%', res.theme),
           }
         }))
         .pipe(gulp.dest("dist/"));

         // Special cases
         if (res.theme == 'brown_paper') {
            console.log ('Copying extra-file brown_papersq.png');
            gulp.src(source_dir+'brown_papersq.png')
            .pipe(gulp.dest('dist/assets/css/'));
         } else if (res.theme == 'pojoaque') {
            console.log ('Copying extra-file pojoaque.jpg');
            gulp.src(source_dir+'pojoaque.jpg')
            .pipe(gulp.dest('dist/assets/css/'));
         } else if (res.theme == 'school_book') {
            console.log ('Copying extra-file school_book.png');
            gulp.src(source_dir+'school_book.png')
            .pipe(gulp.dest('dist/assets/css/'));
         }
   }));
});


// Merge sequence
gulp.task('merge', function(callback) {

  gulp.src('dist/assets')
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
                  ['merge-scripts', 'merge-styles'],
                  'post-merge',
                  callback
                );

              gulp
              .src("dist/config.json")
              .pipe(jeditor({
                'general': {
                  'concat_assets': true
                // },
                // 'assets': {
                //   'jquery': "assets/js/jquery.min.js",
                //   'bootstrap_css': "assets/js/bootstrap.min.css",
                //   'bootstrap_js': "assets/js/bootstrap.min.js",
                //   'font_awesome': "assets/css/font-awesome.min.css",
                //   'stupid_table': "assets/js/stupidtable.min.js",
                //   'searcher': "assets/js/jquery.searcher.min.js",
                //   'highlight_js': "assets/js/highlight.min.js",
                //   'highlight_css': "assets/css/highlight.min.css",
                //   'bootlint': "assets/hs/bootlint.min.js",
                }
              }))
              .pipe(gulp.dest("dist/"));
        }
    }));

});


// Merge JS files
gulp.task('merge-scripts', function(){

    return gulp
    .src([
      'dist/assets/js/bootstrap.min.js',
      'dist/assets/js/highlight.min.js',
      'dist/assets/js/jquery.searcher.min.js',
      'dist/assets/js/stupidtable.min.js',
      'dist/assets/js/listr.min.js'
    ])
    .pipe(concat('listr.pack.js'))
    .pipe(gulp.dest('dist/assets/js/'));
});


// Merge CSS files
gulp.task('merge-styles', function(){

  return gulp.src([
      'dist/assets/css/font-awesome.min.css',
      'dist/assets/css/bootstrap.min.css',
      'dist/assets/css/highlight.min.css',
      'dist/assets/css/listr.min.css'
      // '!dist/assets/css/listr.pack.css'
    ])
    .pipe(concatCss('listr.pack.css'))
    .pipe(cssmin())
    .pipe(gulp.dest('dist/assets/css/'));
});


// Clean up after merge
gulp.task('post-merge', function() {

  return del([
    'dist/assets/css/*.css',
    '!dist/assets/css/listr.pack.css',
    'dist/assets/js/*.js',
    '!dist/assets/js/bootlint.js',
    '!dist/assets/js/jquery.min.js',
    '!dist/assets/js/listr.pack.js'
  ]);
});


//     __         __                   __             __       
//    / /_  ___  / /___  ___  _____   / /_____ ______/ /_______
//   / __ \/ _ \/ / __ \/ _ \/ ___/  / __/ __ `/ ___/ //_/ ___/
//  / / / /  __/ / /_/ /  __/ /     / /_/ /_/ (__  ) ,< (__  ) 
// /_/ /_/\___/_/ .___/\___/_/      \__/\__,_/____/_/|_/____/  
//             /_/                                             

// Clean dist folder
gulp.task('clean', function () {

  return del([
    './dist/'
  ]);
});


// Create file structure in dist/, copy all PHP & .htaccess
gulp.task('init', function() {

  gulp.src([
    './src/index.php',
    './src/listr-functions.php',
    './src/listr-l10n.php',
    './src/listr-template.php'
  ])
  .pipe(gulp.dest('dist/'));

  gulp.src([
      './src/l10n/**/*'
  ])
  .pipe(gulp.dest('dist/l10n/'));
  // gulp.src('./src/l10n/**/*.po')
  // .pipe(gettext())
  // .pipe(gulp.dest('dist'))
  // ;

  gulp.src([
      './src/themes/*'
  ])
  .pipe(gulp.dest('dist/themes/'));

  gulp.src([
      'src/config.json'
  ])
  .pipe(gulp.dest('dist/'));

  gulp.src([
      'src/root.htaccess'
  ])
  .pipe(concat('.htaccess'))
  .pipe(gulp.dest('dist/'));

  gulp.src([
      'src/public.htaccess'
  ])
  .pipe(concat('.htaccess'))
  .pipe(gulp.dest('dist/_public/'));

  gulp.src([
    'node_modules/jquery-stupid-table/stupidtable.min.js',
    'node_modules/jquery/dist/jquery.min.js'
  ])
  .pipe(gulp.dest('dist/assets/js/'));

  gulp.src("src/config.json")
  .pipe(gulp.dest("dist/"));

  if (argv.dist) {
    gulp.start('make');
  }

});


// Upgrade files in dist/. Does not touch config.json and .htaccess files!
gulp.task('upgrade', function() {

  del([
    'dist/assets/css/listr.pack.css',
    'dist/assets/js/listr.pack.js'
  ]);

  gulp.src([
    'src/index.php',
    'src/listr-functions.php',
    'src/listr-l10n.php',
    'src/listr-template.php'
  ])
  .pipe(gulp.dest('dist/'));

  gulp.src([
    './src/l10n/**/*'
  ])
  .pipe(gulp.dest('dist/l10n/'));

  gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/jquery-stupid-table/stupidtable.min.js'
  ])
  .pipe(gulp.dest('dist/assets/js/'));

});


// Reset config.json
gulp.task('reset', function () {
  gulp.src([
    'src/config.json'
  ])
  .pipe(gulp.dest('dist/'));
});


// Lint PHP files
gulp.task('phplint', function(cb) {
  phplint(['src/*.php'], {limit: 10}, function (err, stdout, stderr) {
    if (err) {
      cb(err);
      process.exit(1);
    }
    cb();
  });
});


// Lint CSS files
gulp.task('csslint', function() {

  if (argv.self) return;

  gulp.src([
    'src/style.css'
  ])
  .pipe(cache('linting_css'))
  .pipe(csslint())
  .pipe(csslint.reporter());
});


// Minify CSS files
gulp.task('cssmin', function() {
  console.log('Minifying CSS…');

  gulp.src([
    'src/css/*.css'
  ])
  .pipe(concat('listr.min.css'))
  .pipe(cssmin())
  .pipe(notify("Minfied: <%= file.relative %>"))
  .pipe(gulp.dest('dist/assets/css/'));
});


// Lint JS files
gulp.task('jshint', function() {

   if (argv.self) {
    src = ['gulpfile.js', 'src/js/*.js'];
   } else {
    src = 'src/js/*.js';
   }

  gulp.src(src)
  .pipe(debug())
  .pipe(cache('linting_js'))
  .pipe(jshint())
  .pipe(jshint.reporter());
});


// Minify JS files
gulp.task('uglify', function() {
   console.log('Minifying JavaScript…');

   gulp.src([
     'src/js/*.js'
   ])
   .pipe(uglify())
   .pipe(concat('listr.min.js'))
   .pipe(notify("Uglified: <%= file.relative %>"))
   .pipe(gulp.dest('dist/assets/js/'));
});


// Lint JSON files
gulp.task('jsonlint', function() {
  
  if (argv.self) {
    src = ['package.json', 'src/config.json'];
   } else {
    src = 'src/config.json';
   }

   gulp.src(src)
  .pipe(debug())
  .pipe(cache('linting_json'))
  .pipe(jsonlint())
  .pipe(jsonlint.report('verbose'));
});


// Watch task
gulp.task('watch', function () {
   gulp.watch([
          'gulpfile.js',
          'package.json',
          'src/config.json',
          'src/js/*.js',
          'src/css/*.css'
         ],
         ['lint']
   );
});

// Watch task
gulp.task('_js', function () {
   gulp.watch([
            'src/js/*.js'
         ],
         ['uglify']);
});
gulp.task('_css', function () {
   gulp.watch([
            'src/css/*.css'
         ],
         ['cssmin']);
});

// Help dialog
gulp.task('help', function() {

  var title_length =  meta.name + ' v' + meta.version;

  console.log('\n' + meta.name + ' v' + meta.version);
  console.log(repeat('=', title_length.length));
  console.log('\nAvailable tasks:');
  console.log('        help - This dialog');
  console.log('       clean - Delete dist-folder');
  console.log('       debug - Add Bootlint and jQuery source map');
  console.log('     depends - Specify the source for all dependencies');
  console.log('        init - Create dist-folder and copy required files');
  console.log('       jsmin - Minify config.json');
  console.log('        lint - Run tasks to lint all CSS and JavaScript');
  console.log('        make - Minify all CSS and JavaScript files');
  console.log('       merge - Merge all CSS and JavaScript files');
  console.log('       reset - Reset config.json to default');
  console.log('       setup - Run a full setup');
  console.log(' setup-clean - Force running a clean setup');
  console.log('      swatch - Select default Bootstrap theme');
  console.log('        hjs - Specify default Highlighter.js style-sheet');
  console.log('     upgrade - Upgrade all PHP files in dist-folder');
  console.log('\nVisit our GitHub repository:');
  console.log(meta.homepage);

} );