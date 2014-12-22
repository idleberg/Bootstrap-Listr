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
var colog    = require('colog'),
    concat   = require('gulp-concat'),
    csslint  = require('gulp-csslint'),
    cssmin   = require('gulp-cssmin'),
    del      = require('del'),
    gulp     = require('gulp'),
    jeditor  = require('gulp-json-editor'),
    jshint   = require('gulp-jshint'),
    less     = require('gulp-less'),
    path     = require('path'),
    prompt   = require('gulp-prompt'),
    sequence = require('run-sequence'),
    uglify   = require('gulp-uglify');

/*
 * _|_ _  _|   _|_ _. _  _  _  _ _
 *  | (_|_\|<   | | |(_|(_|(/_| _\
 *                    _| _|       
 */

// Task combos
gulp.task('lint',   ['csslint', 'jshint'/*, 'phplint'*/]);
gulp.task('make',   ['cssmin', 'uglify']);
gulp.task('travis', ['csslint', 'jshint']);
gulp.task('css',    ['csslint', 'cssmin']);
gulp.task('debug',  ['bootlint','jquery']);
gulp.task('js',     ['jshint', 'uglify']);

// Task aliases
gulp.task('default',    ['help']);
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

 // Setup sequence
gulp.task('setup', function(callback) {

  console.log('\n' + meta.name + ' v' + meta.version);
  console.log('The MIT License (MIT)');
  console.log('\nRunning setup');

  sequence(
      'depends',
      'bootswatch',
      'select',
      'make',
      'merge',
      callback
    );
});


// Feature selection
gulp.task('select', function(){

  // Set defaults
  var enable_viewer      = false,
      enable_search      = false;
      enable_highlight   = false;
      default_icons      = 'glyphicons';
      default_hljs_theme = 'github';
      include_bootlint   = false;


  // Setup dialog
  return gulp.src('./')
    .pipe(prompt.prompt({
        type: 'checkbox',
        name: 'feature',
        message: 'Which features would you like to use?',
        choices: ['Viewer Modal', 'Search Box', 'Syntax Highlighter', 'Font Awesome', 'H5BP Apache Server Config', 'robots.txt', 'DEBUG: Bootlint', 'DEBUG: jQuery Source Map'],
      }, function(res){


        // Enable search box
        if (res.feature.indexOf('Search Box') > -1 ) {
          console.info('Including search box assets…');
          
          gulp
            .src([
              'node_modules/jquery/dist/jquery.min.js',
              'node_modules/jquery-searcher/dist/jquery.searcher.min.js'
             ])
            .pipe(gulp.dest('app/assets/js/'))

          enable_search = true;
        } 


        // Enable Viewer Modal modal
        if (res.feature.indexOf('Viewer Modal') > -1) {
          console.log('Compiling Bootstrap scripts…');

          gulp
            .src([
              'node_modules/bootstrap/js/transition.js',
              'node_modules/bootstrap/js/dropdown.js',
              'node_modules/bootstrap/js/modal.js'
            ])
            .pipe(concat('bootstrap.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('app/assets/js/'))

          enable_viewer = true;
        }


        // Include syntax highlighter
         if (res.feature.indexOf('Syntax Highlighter') > -1) {
          console.log('Including syntax highlighter assets…');
 
          gulp
            .src('node_modules/bower_components/highlightjs/highlight.pack.js')
            .pipe(concat('highlight.min.js'))
            .pipe(gulp.dest('app/assets/js/'))

          enable_highlight = true;

          gulp
            .src([
              'node_modules/bower_components/highlightjs/styles/github.css'
            ])
            .pipe(concat('highlight.min.css'))
            .pipe(cssmin())
            .pipe(gulp.dest('app/assets/css/'));

          colog.warning('NOTE: You can change the default highlight.js theme using "gulp hljs"');
        }


        // Set default icons to Font Awesome
        if (res.feature.indexOf('Font Awesome') > -1) {
          console.log('Including Font Awesome assets…');

          gulp
            .src('node_modules/font-awesome/css/font-awesome.min.css')
            .pipe(gulp.dest('app/assets/css/'))

          gulp
            .src('node_modules/font-awesome/fonts/fontawesome-webfont.*')
            .pipe(gulp.dest('app/assets/fonts/'))

          del([
              'app/assets/fonts/glyphicons-halflings-regular.*'
            ])

          default_icons = 'fontawesome';
        }


        // Include H5BP Apache Config
        if (res.feature.indexOf('H5BP Apache Server Config') > -1) {
          console.log('Appending H5BP Apache server configuration…');

          gulp
            .src([
              'src/root.htaccess',
              'node_modules/apache-server-configs/dist/.htaccess'
              ])
            .pipe(concat('.htaccess'))
            .pipe(gulp.dest('app/'))
        }


        // Include robots.txt 
        if (res.feature.indexOf('robots.txt') > -1) {
          console.log('Including robots.txt…');

          gulp
            .src('src/robots.txt')
            .pipe(concat('robots.txt'))
            .pipe(gulp.dest('app/'))
        }


        // Include Bootlint for debugging
        if (res.feature.indexOf('DEBUG: Bootlint') > -1) {

          gulp
            .src('node_modules/bootlint/dist/browser/bootlint.js')
            .pipe(gulp.dest('app/assets/js/'))

          include_bootlint = true;
        }


        // Include Bootlint for debugging
        if (res.feature.indexOf('DEBUG: jQuery Source Map') > -1) {


          gulp
            .src([
              'node_modules/jquery/dist/jquery.min.js',
              'node_modules/jquery/dist/jquery.min.map'
            ])
            .pipe(gulp.dest('app/assets/js/'))
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
              'highlight': {
                'theme': default_hljs_theme
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
        type: 'input',
        name: 'dependencies',
        message: 'Do you want to load dependencies locally (l) or from CDN (c)?',
        default: 'l'
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

  var bootswatch     = ['(none)','Amelia','Cerulean','Cosmo','Cyborg','Darkly','Flatly','Journal','Lumen','M8tro','Paper','Readable','Sandstone','Simplex','Slate','Spacelab','Superhero','United','Yeti'],
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
        type: 'checkbox',
        name: 'theme',
        message: 'Choose your a default Bootswatch theme',
        choices: bootswatch,
      }, function(res){

          // Warn if multiple items selected
          if (res.theme.length > 1) {
            if (res.theme[0] == '(none)') {
                var selection = 'default';
            } else {
              var selection = '“'+res.theme[0]+'”';
            }
            colog.error('ERROR: You can only select one theme, using '+selection)
          }

          // Copy glyphicons
          gulp
            .src('node_modules/bootstrap/fonts/*')
            .pipe(gulp.dest('app/assets/fonts/'))

          // Set default theme
          if ((res.theme[0] === '(none)') || (res.theme == '')) {
              
              console.log('Compiling default Bootstrap theme…')

              gulp.src(bootstrap_less)
              .pipe(concat('bootstrap.less'))
              .pipe(less({
                paths: [ path.join(__dirname, 'less', 'includes') ]
              }))
              .pipe(concat('bootstrap.min.css'))
              .pipe(cssmin())
              .pipe(gulp.dest('app/assets/css/'))
              
              gulp.src("app/config.json")
              .pipe(jeditor({
                'bootstrap': {
                  'theme': 'default'
                }
              }))
              .pipe(gulp.dest("app/"));

          // Set M8tro theme (http://idleberg.github.io/m8tro-bootstrap/)
          } else if (res.theme[0] === 'M8tro') {
            console.log('Copying M8tro Bootstrap theme…')

            gulp.src('node_modules/bower_components/m8tro-bootstrap/dist/css/m8tro.min.css')
            .pipe(gulp.dest('app/assets/css/'))
            
            gulp.src("app/config.json")
            .pipe(jeditor({
              'bootstrap': {
                'theme': 'm8tro'
              }
            }))
            .pipe(gulp.dest("app/"));

          // Set Bootswatch theme
          } else if (bootswatch.indexOf(res.theme[0])  > -1 ) {
              
              var slug = res.theme[0].toLowerCase();
              console.log('Compiling Bootswatch theme “'+res.theme+'”…')

              bootstrap_less.push('node_modules/bootswatch/' + slug + '/variables.less')
              bootstrap_less.push('node_modules/bootswatch/' + slug + '/bootswatch.less')
              
              gulp.src(bootstrap_less)
              .pipe(concat('bootstrap.less'))
              .pipe(less({
                paths: [ path.join(__dirname, 'less', 'includes') ]
              }))
              .pipe(concat('bootstrap.min.css'))
              .pipe(cssmin())
              .pipe(gulp.dest('app/assets/css/'))

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

 var hljs = ['arta', 'ascetic', 'atelier-dune.dark', 'atelier-dune.light', 'atelier-forest.dark', 'atelier-forest.light', 'atelier-heath.dark', 'atelier-heath.light', 'atelier-lakeside.dark', 'atelier-lakeside.light', 'atelier-seaside.dark', 'atelier-seaside.light', 'brown_paper', 'codepen-embed', 'color-brewer', 'dark', 'default', 'docco', 'far', 'foundation', 'github', 'googlecode', 'hybrid', 'idea', 'ir_black', 'kimbie.dark', 'kimbie.light', 'magula', 'mono-blue', 'monokai_sublime', 'monokai', 'obsidian', 'paraiso.dark', 'paraiso.light', 'pojoaque', 'railscasts', 'rainbow', 'school_book', 'solarized_dark', 'solarized_light', 'sunburst', 'tomorrow-night-blue', 'tomorrow-night-bright', 'tomorrow-night-eighties', 'tomorrow-night', 'tomorrow', 'vs', 'xcode', 'zenburn'];

 return gulp.src('./')
   .pipe(prompt.prompt({
       type: 'checkbox',
       name: 'theme',
       message: 'Choose your a default highlight.js theme',
       choices: hljs,
     }, function(res){

         // Warn if multiple items selected
         if (res.theme.length > 1) {
           
           var selection = '“'+res.theme[0]+'”';
           colog.error('ERROR: You can only select one theme, using '+selection)
         }

        var source_dir = 'node_modules/bower_components/highlightjs/styles/'

         // Set default theme
         if (res.theme == '') {
             
             console.log('Minifying highlight.js theme “github.css”…');

             gulp.src(source_dir+'github.css')
             .pipe(concat('highlight.min.css'))
             .pipe(cssmin())
             .pipe(gulp.dest('app/assets/css/'));
             
             gulp.src("app/config.json")
             .pipe(jeditor({
               'highlight': {
                 'theme': 'github'
               }
             }))
             .pipe(gulp.dest("app/"));


         // Set highlight.js theme
         } else if (hljs.indexOf(res.theme[0])  > -1 ) {
             
             console.log('Minifying highlight.js theme “'+res.theme[0]+'”…');
             gulp.src(source_dir+res.theme[0]+'.css')
             .pipe(concat('highlight.min.css'))
             .pipe(cssmin())
             .pipe(gulp.dest('app/assets/css/'));

             gulp.src("app/config.json")
             .pipe(jeditor({
               'highlight': {
                 'theme': res.theme[0]
               }
             }))
             .pipe(gulp.dest("app/"));

             // Special cases
            if (res.theme[0] == 'brown_paper') {

               console.log ('Copying extra-file brown_papersq.png');
               gulp.src('node_modules/bower_components/highlightjs/styles/brown_papersq.png')
               .pipe(gulp.dest('app/assets/css/'));
            } else if (res.theme[0] == 'pojoaque') {
               console.log ('Copying extra-file pojoaque.jpg');
               gulp.src('node_modules/bower_components/highlightjs/styles/pojoaque.jpg')
               .pipe(gulp.dest('app/assets/css/'));
            } else if (res.theme[0] == 'school_book') {
               console.log ('Copying extra-file school_book.png');
               gulp.src('node_modules/bower_components/highlightjs/styles/school_book.png')
               .pipe(gulp.dest('app/assets/css/'));
            }
         }
       
   }));
});


// Merge sequence
gulp.task('merge', function(callback) {

  gulp.src('app/assets')
    .pipe(prompt.prompt({
        type: 'input',
        name: 'merge',
        message: 'Do you want to merge all assets?',
        default: 'y'
    }, function(res){
        if(res.merge === 'y') {
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
    .pipe(gulp.dest('app/assets/js/'))
});


// Merge CSS files
gulp.task('merge-styles', function(){

  return gulp.src([
      'app/assets/css/*.css',
      '!app/assets/css/listr.pack.css'
    ])
    .pipe(concat('listr.pack.css'))
    .pipe(gulp.dest('app/assets/css/'))
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
  ])
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
gulp.task('init', function() {

  del([
    'app/assets'
  ])

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

  gulp.src('node_modules/stupid-jquery-table-sort/stupidtable.min.js')
  .pipe(gulp.dest('app/assets/js/'))

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
])

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
  .pipe(csslint())
  .pipe(csslint.reporter())
});


// Minify CSS files
gulp.task('cssmin', function() {
  gulp.src([
    'src/style.css'
  ])
  .pipe(concat('listr.min.css'))
  .pipe(cssmin())
  .pipe(gulp.dest('app/assets/css/'))
});


// Lint JS files
gulp.task('jshint', function() {
  gulp.src([
    'src/config.json',
    'src/scripts.js'
  ])
  .pipe(jshint())
  .pipe(jshint.reporter())
});


// Minify JS files
gulp.task('uglify', function() {
   gulp.src([
     'src/scripts.js'
   ])
   .pipe(uglify())
   .pipe(concat('listr.min.js'))
   .pipe(gulp.dest('app/assets/js/'))
});


// Help dialog
gulp.task('help', function() {

  var title_length =  meta.name + ' v' + meta.version;

  console.log('\n' + meta.name + ' v' + meta.version);
  console.log(repeat('=', title_length.length));
  console.log('\nAvailable tasks:')
  console.log('         help - This dialog')
  console.log('        clean - Delete app-folder')
  console.log('        debug - Add Bootlint and jQuery source map')
  console.log('      depends - Specify the source for all dependencies')
  console.log('         init - Create app-folder and copy required files')
  console.log('        jsmin - Minify config.json')
  console.log('         lint - Run tasks to lint all CSS, JavaScript and PHP files')
  console.log('         make - Minify all CSS and JavaScript files')
  console.log('        merge - Merge all CSS and JavaScript files')
  console.log('        reset - Reset config.json to default')
  console.log('        setup - Run a full setup')
  console.log('       swatch - Select default Bootstrap theme')
  console.log('         hljs - Specify default Highlighter.js style-sheet')
  console.log('      upgrade - Upgrade all PHP files in app-folder')
  console.log('\nVisit our GitHub repository:')
  console.log(meta.homepage)

} )