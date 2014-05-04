/**
 * Gruntfile.js
 */
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    phplint: {
        options: {
            swapPath: '/tmp'
        },
        all: ['index.php']
    }
  });

  grunt.loadNpmTasks('grunt-phplint');
  grunt.loadNpmTasks('grunt-notify');
  grunt.registerTask('precommit', ['phplint:all']);
  grunt.registerTask('default', ['phplint:all']);
};