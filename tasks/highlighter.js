var
  argv    = require('yargs').alias('s', 'self').argv,
  concat  = require('gulp-concat'),
  cssmin  = require('gulp-cssmin'),
  fs      = require("fs"),
  gulp    = require('gulp'),
  jeditor = require('gulp-json-editor'),
  prompt    = require('gulp-prompt');

var hjs = [];

function getBasename(file) {
  if(file.substr(file.lastIndexOf('.')+1) == 'css') {
    hjs.push( file.substring(0, file.lastIndexOf(".")) );
  }
}

// Build Highlight.js (via https://github.com/kilianc/rtail/blob/develop/gulpfile.js#L69)
gulp.task('build:highlighter', function (done) {

  var languages = ['tools/build.js'];
  var config = require(__dirname + '/../src/config.json').highlight.languages;
  config.forEach(function(item) {
    languages.push(item);
  });

  var spawn = require('child_process').spawn;
  var opts = {
    cwd: 'node_modules/highlight.js'
  };

  var npmInstall = spawn('npm', ['install'], opts);
  npmInstall.stdout.pipe(process.stdout);
  npmInstall.stderr.pipe(process.stderr);

  npmInstall.on('close', function (code) {
    if (0 !== code) throw new Error('npm install exited with ' + code);

    var build = spawn('node', languages, opts);
    build.stdout.pipe(process.stdout);
    build.stderr.pipe(process.stderr);

    build.on('close', function (code) {
      if (0 !== code) throw new Error('node tools/build.js exited with ' + code);
      done();
    });
  });
});

// Choose a highlight.js theme
gulp.task('select:highlighter', function(){

  var source_dir = 'node_modules/highlight.js/src/styles/';

  css = fs.readdirSync(source_dir);
  css.forEach(getBasename);

  hjs.sort();
  hjs = hjs.concat(hjs.splice(0,hjs.indexOf('github')));

  return gulp.src('./')
  .pipe(prompt.prompt({
   type: 'list',
   name: 'theme',
   message: 'Choose a highlight.js theme',
   choices: hjs,
 }, function(res){

    var source_dir = 'node_modules/highlight.js/src/styles/';

     // Set default theme
     console.log('Minifying highlight.js theme “'+res.theme+'”…');
     gulp.src(source_dir+res.theme+'.css')
     .pipe(concat('highlight.min.css'))
     .pipe(cssmin())
     .pipe(gulp.dest('build/assets/css/'));

     gulp.src("build/config.json")
     .pipe(jeditor({
       'highlight': {
         'theme': res.theme
       }
     }))
     .pipe(gulp.dest("build/"));

     // Special cases
     if (res.theme == 'brown_paper') {
      console.log ('Copying extra-file brown_papersq.png');
      gulp.src(source_dir+'brown_papersq.png')
      .pipe(gulp.dest('build/assets/css/'));
    } else if (res.theme == 'pojoaque') {
      console.log ('Copying extra-file pojoaque.jpg');
      gulp.src(source_dir+'pojoaque.jpg')
      .pipe(gulp.dest('build/assets/css/'));
    } else if (res.theme == 'school_book') {
      console.log ('Copying extra-file school_book.png');
      gulp.src(source_dir+'school_book.png')
      .pipe(gulp.dest('build/assets/css/'));
    }
  }));
});