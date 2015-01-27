module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint')

  // commonjs to module for browser
  grunt.loadNpmTasks('grunt-browserify')

  grunt.initConfig({
    browserify: {
        build: {
            src: 'src/browser.js',
            dest: 'dist/siteswap-generator.js'
        }
    },
  });

  grunt.registerTask('default', 'browserify');

};