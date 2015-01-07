/*
 *   _  _. _ |_ | _  _
 *\/(_|| |(_||_)|(/__\
 *                                     
 */

// Read package.json metadata
var meta     = require('./package.json');


// A handy repeat function
  var repeat = function (s, n, d) {
    return --n ? s + (d || "") + repeat(s, n, d) : "" + s;
  };


// Gulp plugins
var console  = require('better-console'),
    cache    = require('gulp-cached'),
    concat   = require('gulp-concat'),
    csslint  = require('gulp-csslint'),
    cssmin   = require('gulp-cssmin'),
    del      = require('del'),
    fs       = require('fs'),
    gulp     = require('gulp'),
    jeditor  = require('gulp-json-editor'),
    jshint   = require('gulp-jshint'),
    jsonlint = require('gulp-json-lint'),
    less     = require('gulp-less'),
    path     = require('path'),
    prompt   = require('gulp-prompt'),
    sequence = require('run-sequence'),
    uglify   = require('gulp-uglify'),
    watch    = require('gulp-watch'),
    argv     = require('yargs').argv;


/*
 * _|_ _  _|   _|_ _. _  _  _  _ _
 *  | (_|_\|<   | | |(_|(_|(/_| _\
 *                    _| _|       
 */

// Task combos
gulp.task('lint',      ['csslint', 'jshint', 'jsonlint' /*, 'phplint'*/]);
gulp.task('make',      ['cssmin', 'uglify']);
gulp.task('travis',    ['csslint', 'jshint']);
gulp.task('css',       ['csslint', 'cssmin']);
gulp.task('debug',     ['bootlint','jquery']);
gulp.task('js',        ['jshint', 'uglify']);


// Task aliases
gulp.task('deps',       ['depends']);
gulp.task('jsmin',      ['uglify']);
gulp.task('minify',     ['make']);
// gulp.task('php',        ['phplint']);
gulp.task('bootswatch', ['swatch']);
gulp.task('update',     ['upgrade']);


/*
 *  _ _ _|_   _   _|_ _  _|  _
 * _\(/_ ||_||_)   | (_|_\|<_\
 *           |              
 */


// Default task
gulp.task('default', false, function (callback) {
  setTimeout(function() {

    console.clear();
    console.log('\n' + meta.name + ' v' + meta.version);
    console.log('The MIT License (MIT)');

    if( !fs.existsSync('./app/config.json')) {
      console.log('\nRunning setup…');
      sequence(
        'init',
        'setup',
        callback
      );
    } else {
      console.log('\nConfiguration file detected\nRunning upgrade…');
      gulp.start('upgrade');
    }
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


// Clean install
gulp.task('install', ['clean'], function(callback) {

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

  var features = [
        { name: 'Viewer Modal', value: 'viewer' , checked: true },
        { name: 'Search Box', value: 'search' , checked: true },
        { name: 'Syntax Highlighter', value: 'highlighter' , checked: true },
        { name: 'Font Awesome', value: 'font_awesome' , checked: true },
        { name: 'H5BP Apache Server Config', value: 'htaccess' , checked: true },
        { name: 'robots.txt', value: 'robots' , checked: true },
        { name: 'DEBUG: Bootlint', value: 'bootlint' ,checked: false },
        { name: 'DEBUG: jQuery Source Map', value: 'jquery_map', checked: false }
      ];

  // uncheck all features
  if (argv.min) {
    for (var i = 0; i < 6; i++) {
       features[i].checked =  false;
    }
  }

  // check debug features
  if (argv.debug) {
       features[6].checked =  true;
       features[7].checked =  true;
  }

  // Setup dialog
  return gulp.src('./')
    .pipe(prompt.prompt({
        type: 'checkbox',
        name: 'feature',
        message: 'Which features would you like to use?',
        choices: features,
      }, function(res){


        // Enable search box
        if (res.feature.indexOf('search') > -1 ) {
          console.info('Including search box assets…');
          
          gulp
            .src([
              'node_modules/jquery/dist/jquery.min.js',
              'node_modules/jquery-searcher/dist/jquery.searcher.min.js'
             ])
            .pipe(gulp.dest('app/assets/js/'));

          enable_search = true;
        } 


        // Enable Viewer Modal modal
        if (res.feature.indexOf('viewer') > -1) {
          console.log('Compiling Bootstrap scripts…');

          gulp
            .src([
              'node_modules/bootstrap/js/transition.js',
              'node_modules/bootstrap/js/dropdown.js',
              'node_modules/bootstrap/js/modal.js'
            ])
            .pipe(concat('bootstrap.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('app/assets/js/'));

          enable_viewer = true;
        }


        // Include syntax highlighter
         if (res.feature.indexOf('highlighter') > -1) {
          console.log('Including syntax highlighter assets…');
 
          gulp
            .src('node_modules/_bower_components/highlightjs/highlight.pack.js')
            .pipe(concat('highlight.min.js'))
            .pipe(gulp.dest('app/assets/js/'));

          enable_highlight = true;

          gulp
            .src([
              'node_modules/_bower_components/highlightjs/styles/github.css'
            ])
            .pipe(concat('highlight.min.css'))
            .pipe(cssmin())
            .pipe(gulp.dest('app/assets/css/'));

            gulp.start('hljs');
        }

        // Set default icons to Font Awesome
        if (res.feature.indexOf('font_awesome') > -1) {
          console.log('Including Font Awesome assets…');

          gulp
            .src('node_modules/font-awesome/css/font-awesome.min.css')
            .pipe(gulp.dest('app/assets/css/'));

          gulp
            .src('node_modules/font-awesome/fonts/fontawesome-webfont.*')
            .pipe(gulp.dest('app/assets/fonts/'));

          del([
              'app/assets/fonts/glyphicons-halflings-regular.*'
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
            .pipe(gulp.dest('app/'));
        }


        // Include robots.txt 
        if (res.feature.indexOf('robots') > -1) {
          console.log('Including robots.txt…');

          gulp
            .src('src/robots.txt')
            .pipe(concat('robots.txt'))
            .pipe(gulp.dest('app/'));
        }


        // Include Bootlint for debugging
        if (res.feature.indexOf('bootlint') > -1) {

          gulp
            .src('node_modules/bootlint/dist/browser/bootlint.js')
            .pipe(gulp.dest('app/assets/js/'));

          include_bootlint = true;
        }


        // Include Bootlint for debugging
        if (res.feature.indexOf('jquery_map') > -1) {


          gulp
            .src([
              'node_modules/jquery/dist/jquery.min.js',
              'node_modules/jquery/dist/jquery.min.map'
            ])
            .pipe(gulp.dest('app/assets/js/'));
        }


        // Write settings to config.json
        gulp.src("app/config.json")
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
            .pipe(gulp.dest("app/"));
        
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
        
        if( (res.dependencies === 'l') || (res.dependencies === 'local') ) {


            gulp.src("app/config.json")
            .pipe(jeditor({
              'general': {
                'dependencies': "local"
              }
            }))
            .pipe(gulp.dest("app/"));

        } else if( (res.dependencies === 'c')  || (res.dependencies === 'cdn') ) {
            gulp.src("app/config.json")
            .pipe(jeditor({
              'general': {
                'dependencies': "cdn"
              }
            }))
            .pipe(gulp.dest("app/"));
        }
    }));
});


// Select Bootstrap theme
gulp.task('swatch', function(){

  var bootswatch     = ['(default)','Cerulean','Cosmo','Cyborg','Darkly','Flatly','Journal','Lumen','M8tro','Paper','Readable','Sandstone','Simplex','Slate','Spacelab','Superhero','United','Yeti'],
      bootstrap_less = [
          'node_modules/bootstrap/less/variables.less',
          'node_modules/bootstrap/less/mixins.less',
          'node_modules/bootstrap/less/normalize.less',
          'node_modules/bootstrap/less/glyphicons.less',
          'node_modules/bootstrap/less/scaffolding.less',
          'node_modules/bootstrap/less/type.less',
          'node_modules/bootstrap/less/code.less',
          'node_modules/bootstrap/less/grid.less',
          'node_modules/bootstrap/less/tables.less',
          'node_modules/bootstrap/less/buttons.less',
          'node_modules/bootstrap/less/forms.less',
          'node_modules/bootstrap/less/component-animations.less',
          'node_modules/bootstrap/less/dropdowns.less',
          'node_modules/bootstrap/less/button-groups.less',
          'node_modules/bootstrap/less/breadcrumbs.less',
          'node_modules/bootstrap/less/responsive-embed.less',
          'node_modules/bootstrap/less/close.less',
          'node_modules/bootstrap/less/modals.less',
          'node_modules/bootstrap/less/utilities.less',
          'node_modules/bootstrap/less/responsive-utilities.less'
        ];
      
  return gulp.src('./')
    .pipe(prompt.prompt({
        type: 'list',
        name: 'theme',
        message: 'Choose a Bootstrap theme',
        choices: bootswatch,
      }, function(res){

          // Copy glyphicons
          gulp
            .src('node_modules/bootstrap/fonts/*')
            .pipe(gulp.dest('app/assets/fonts/'));

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
              .pipe(gulp.dest('app/assets/css/'));
              
              gulp.src("app/config.json")
              .pipe(jeditor({
                'bootstrap': {
                  'theme': 'default'
                }
              }))
              .pipe(gulp.dest("app/"));

          // Set M8tro theme (http://idleberg.github.io/m8tro-bootstrap/)
          } else if (res.theme === 'M8tro') {

            slug = res.theme.toLowerCase();
            console.log('Compiling Bootstrap theme “M8tro”');

            bootstrap_less.push('node_modules/_bower_components/m8tro-bootstrap/src/themes/m8tro/palette.less');
            bootstrap_less.push('node_modules/_bower_components/m8tro-bootstrap/src/themes/m8tro-variables.less');
            bootstrap_less.push('node_modules/_bower_components/m8tro-bootstrap/src/themes/m8tro-theme.less');

            gulp.src(bootstrap_less)
            .pipe(concat('bootstrap.less'))
            .pipe(less({
              paths: [ path.join(__dirname, 'less', 'includes') ]
            }))
            .pipe(concat('bootstrap.min.css'))
            .pipe(cssmin())
            .pipe(gulp.dest('app/assets/css/'));
            
            gulp.src("app/config.json")
            .pipe(jeditor({
              'bootstrap': {
                'theme': 'm8tro'
              }
            }))
            .pipe(gulp.dest("app/"));

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
              .pipe(gulp.dest('app/assets/css/'));

              gulp.src("app/config.json")
              .pipe(jeditor({
                'bootstrap': {
                  'theme': slug
                }
              }))
              .pipe(gulp.dest("app/"));
          }
    }));
});


// Choose a highlight.js theme
gulp.task('hljs', function(){

 var hljs = [ 'github', 'googlecode', 'hybrid', 'idea', 'ir_black', 'kimbie.dark', 'kimbie.light', 'magula', 'mono-blue', 'monokai_sublime', 'monokai', 'obsidian', 'paraiso.dark', 'paraiso.light', 'pojoaque', 'railscasts', 'rainbow', 'school_book', 'solarized_dark', 'solarized_light', 'sunburst', 'tomorrow-night-blue', 'tomorrow-night-bright', 'tomorrow-night-eighties', 'tomorrow-night', 'tomorrow', 'vs', 'xcode', 'zenburn', 'arta', 'ascetic', 'atelier-dune.dark', 'atelier-dune.light', 'atelier-forest.dark', 'atelier-forest.light', 'atelier-heath.dark', 'atelier-heath.light', 'atelier-lakeside.dark', 'atelier-lakeside.light', 'atelier-seaside.dark', 'atelier-seaside.light', 'brown_paper', 'codepen-embed', 'color-brewer', 'dark', 'default', 'docco', 'far', 'foundation' ];

  return gulp.src('./')
   .pipe(prompt.prompt({
       type: 'list',
       name: 'theme',
       message: 'Choose a highlight.js theme',
       choices: hljs,
     }, function(res){

        var source_dir = 'node_modules/_bower_components/highlightjs/styles/';

         // Set default theme
         console.log('Minifying highlight.js theme “'+res.theme+'”…');
         gulp.src(source_dir+res.theme+'.css')
         .pipe(concat('highlight.min.css'))
         .pipe(cssmin())
         .pipe(gulp.dest('app/assets/css/'));

         gulp.src("app/config.json")
         .pipe(jeditor({
           'highlight': {
             'theme': res.theme
           }
         }))
         .pipe(gulp.dest("app/"));

         // Special cases
         if (res.theme == 'brown_paper') {
            console.log ('Copying extra-file brown_papersq.png');
            gulp.src('node_modules/_bower_components/highlightjs/styles/brown_papersq.png')
            .pipe(gulp.dest('app/assets/css/'));
         } else if (res.theme == 'pojoaque') {
            console.log ('Copying extra-file pojoaque.jpg');
            gulp.src('node_modules/_bower_components/highlightjs/styles/pojoaque.jpg')
            .pipe(gulp.dest('app/assets/css/'));
         } else if (res.theme == 'school_book') {
            console.log ('Copying extra-file school_book.png');
            gulp.src('node_modules/_bower_components/highlightjs/styles/school_book.png')
            .pipe(gulp.dest('app/assets/css/'));
         }
   }));
});


// Merge sequence
gulp.task('merge', function(callback) {

  gulp.src('app/assets')
    .pipe(prompt.prompt({
        type: 'list',
        name: 'merge',
        message: 'Do you want to merge all assets?',
        choices: [
          'No, keep individual file',
          {
            name: 'Yes, merge all assets',
            value: 'merge'
          }
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
              .src("app/config.json")
              .pipe(jeditor({
                'general': {
                  'dependencies': "pack"
                }
              }))
              .pipe(gulp.dest("app/"));
        }
    }));

});


// Merge JS files
gulp.task('merge-scripts', function(){

    return gulp
    .src([
      'app/assets/js/*.js',
      '!app/assets/js/bootlint.js',
      '!app/assets/js/jquery.min.js',
      '!app/assets/js/listr.pack.js'
    ])
    .pipe(concat('listr.pack.js'))
    .pipe(gulp.dest('app/assets/js/'));
});


// Merge CSS files
gulp.task('merge-styles', function(){

  return gulp.src([
      'app/assets/css/*.css',
      '!app/assets/css/listr.pack.css'
    ])
    .pipe(concat('listr.pack.css'))
    .pipe(gulp.dest('app/assets/css/'));
});


// Clean up after merge
gulp.task('post-merge', function() {

  return del([
    'app/assets/css/*.css',
    '!app/assets/css/listr.pack.css',
    'app/assets/js/*.js',
    '!app/assets/js/bootlint.js',
    '!app/assets/js/jquery.min.js',
    '!app/assets/js/listr.pack.js'
  ]);
});


/*
 * |_  _ | _  _  _  _|_ _  _|  _
 * | |(/_||_)(/_|    | (_|_\|<_\
 *        |                     
 */

// Clean app folder
gulp.task('clean', function () {
  return del(['app/']);
});


// Create file structure in app/, copy all PHP & .htaccess
gulp.task('init', ['clean'], function() {

  gulp.src([
    'src/index.php',
    'src/listr-functions.php',
    'src/listr-l10n.php',
    'src/listr-template.php'
  ])
  .pipe(gulp.dest('app/'));

  gulp.src([
      'src/locale/**/*'
    ])
  .pipe(gulp.dest('app/locale/'));

  gulp.src([
      'src/config.json'
  ])
  .pipe(concat('config.json'))
  .pipe(gulp.dest('app/'));

  gulp.src([
      'src/root.htaccess'
  ])
  .pipe(concat('.htaccess'))
  .pipe(gulp.dest('app/'));

  gulp.src([
      'src/public.htaccess'
  ])
  .pipe(concat('.htaccess'))
  .pipe(gulp.dest('app/_public/'));

  gulp.src('node_modules/_bower_components/stupid-jquery-table-sort/stupidtable.min.js')
  .pipe(concat('stupidtable.min.js'))
  .pipe(gulp.dest('app/assets/js/'));

  gulp.src("app/config.json")
  .pipe(jeditor({
    'general': {
      'enable_sort': true
    }
  }))
  .pipe(gulp.dest("app/"));
});


// Upgrade files in app/. Does not touch config.json and .htaccess files!
gulp.task('upgrade', function() {

  del([
    'app/assets/css/listr.pack.css',
    'app/assets/js/listr.pack.js'
  ]);

  gulp.src([
    'src/index.php',
    'src/listr-functions.php',
    'src/listr-l10n.php',
    'src/listr-template.php'
  ])
  .pipe(gulp.dest('app/'));

  gulp.src([
    'src/locale/**/*'
  ])
  .pipe(gulp.dest('app/locale/'));

  gulp.src('node_modules/_bower_components/stupid-jquery-table-sort/stupidtable.min.js')
  .pipe(concat('stupidtable.min.js'))
  .pipe(gulp.dest('app/assets/js/'));

});


// Reset config.json
gulp.task('reset', function () {
  gulp.src([
    'src/config.json'
  ])
  .pipe(gulp.dest('app/'));
});


// Lint PHP files
// gulp.task('phplint', function () {
//   return phplint([
//         'src/*.php'
//     ]);
// });


// Lint CSS files
gulp.task('csslint', function() {
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
    'src/style.css'
  ])
  .pipe(concat('listr.min.css'))
  .pipe(cssmin())
  .pipe(gulp.dest('app/assets/css/'));
});


// Lint JS files
gulp.task('jshint', function() {
  gulp.src([
    'gulpfile.js',
    'src/scripts.js'
  ])
  .pipe(cache('linting_js'))
  .pipe(jshint())
  .pipe(jshint.reporter());
});


// Minify JS files
gulp.task('uglify', function() {
   console.log('Minifying JavaScript…');

   gulp.src([
     'src/scripts.js'
   ])
   .pipe(uglify())
   .pipe(concat('listr.min.js'))
   .pipe(gulp.dest('app/assets/js/'));
});


// Lint JSON files
gulp.task('jsonlint', function() {
  gulp.src([
    'package.json',
    'src/config.json'
  ])
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
          'src/scripts.js',
          'src/style.css'
         ],
         ['lint']
   );
});


// Help dialog
gulp.task('help', function() {

  var title_length =  meta.name + ' v' + meta.version;

  console.log('\n' + meta.name + ' v' + meta.version);
  console.log(repeat('=', title_length.length));
  console.log('\nAvailable tasks:');
  console.log('         help - This dialog');
  console.log('        clean - Delete app-folder');
  console.log('        debug - Add Bootlint and jQuery source map');
  console.log('      depends - Specify the source for all dependencies');
  console.log('         init - Create app-folder and copy required files');
  console.log('      install - Run a clean installation');
  console.log('        jsmin - Minify config.json');
  console.log('         lint - Run tasks to lint all CSS and JavaScript');
  console.log('         make - Minify all CSS and JavaScript files');
  console.log('        merge - Merge all CSS and JavaScript files');
  console.log('        reset - Reset config.json to default');
  console.log('        setup - Run a full setup');
  console.log('       swatch - Select default Bootstrap theme');
  console.log('         hljs - Specify default Highlighter.js style-sheet');
  console.log('      upgrade - Upgrade all PHP files in app-folder');
  console.log('\nVisit our GitHub repository:');
  console.log(meta.homepage);

} );