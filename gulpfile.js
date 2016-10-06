const console  = require('better-console');
const fs       = require('fs');
const gulp     = require('gulp');
const sequence = require('run-sequence');
const meta     = require('./package.json');

// Import tasks
require('./tasks/clean.js');
require('./tasks/copy-files.js');
require('./tasks/help.js');
require('./tasks/highlighter.js');
require('./tasks/jshint.js');
require('./tasks/jsonlint.js');
require('./tasks/merge.js');
require('./tasks/phplint.js');
require('./tasks/scss.js');
require('./tasks/scsslint.js');
require('./tasks/setup.js');
require('./tasks/uglify.js');
require('./tasks/watch.js');

// Task combos
gulp.task('lint',    ['lint:scss','lint:js', 'lint:json', 'lint:php']);
gulp.task('css',     ['lint:scss','scss']);
gulp.task('debug',   ['bootlint', 'jquery']);
gulp.task('init',    ['copy']);
gulp.task('make',    ['make:scss','make:js']);
gulp.task('travis',  ['lint:js']);
gulp.task('upgrade', ['clean:pack', 'copy:css', 'copy:fonts', 'copy:js', 'copy:l10n', 'copy:php', 'copy:themes']);

// Task aliases
gulp.task('deps',    ['depends']);
gulp.task('jsmin',   ['make:js']);
gulp.task('minify',  ['make']);
gulp.task('scssmin', ['make:scss']);
gulp.task('uglify',  ['make:js']);
gulp.task('updaze',  ['upgrade']);

// Default task
gulp.task('default', ['build:highlighter'], function (callback) {
  setTimeout(function() {

    if ( !fs.existsSync('./build/config.json') ){
      console.log('\nLet\'s set this up!\n');
      tasks = [
        'copy',
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
