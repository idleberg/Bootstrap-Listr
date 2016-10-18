const gulp = require('gulp');
const meta = require('../package.json');

// A handy repeat function
var repeat = function (s, n, d) {
  return --n ? s + (d || "") + repeat(s, n, d) : "" + s;
};

// Help dialog
gulp.task('help', function() {
  let title_length =  meta.name + ' v' + meta.version;

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
  console.log('       setup - Run a full setup');
  console.log('        hjs - Specify default Highlighter.js style-sheet');
  console.log('\nVisit our GitHub repository:');
  console.log(meta.homepage);

} );