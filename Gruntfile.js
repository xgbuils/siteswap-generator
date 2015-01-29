module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint')

  // commonjs to module for browser
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-concurrent'); // executar tasques paralelament
  grunt.loadNpmTasks('grunt-contrib-stylus')

  grunt.initConfig({
    connect: {
      dev: {
        options: {
          port: 9090,
          hostname: 'localhost',
          base: 'gh-pages/dev',
          livereload: true
        },
        middleware: function(connect, options) {
          return [
            require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
            connect.static(options.base)
          ];
        }
      },
      prod: {
        options: {
          port: 9099,
          hostname: 'localhost',
          base: 'gh-pages/prod',
          livereload: true
        }
      },
    },
    watch: {
      options: {
        livereload: true
      },
      'scripts-dev': {
        files: ['src/**/*.js'],
        tasks: ['browserify:dev']
      },
      'scripts-prod': {
        files: ['src/**/*.js'],
        tasks: ['browserify:prod']
      },
      'stylus-dev': {
        files: ['src/**/*.styl'],
        tasks: ['stylus:dev']
      },
      'stylus-prod': {
        files: ['src/**/*.styl'],
        tasks: ['stylus:prod']
      },
      'copy-dev': {
        files: ['src/**/*.html'],
        tasks: ['copy:dev']
      },
      'copy-prod': {
        files: ['src/**/*.html'],
        tasks: ['copy:prod']
      }
    },
    browserify: {
      dev: {
        src: 'src/gh-pages/js/main.js',
        dest: 'gh-pages/dev/js/main.js'
      },
      prod: {
        src: 'src/gh-pages/js/main.js',
        dest: 'gh-pages/prod/js/main.js'
      }
    },
    stylus: {
      dev: {
        options: {
          linenos: false,
          compress: false
        },
        files: [{
          expand: true,
          cwd: 'src/gh-pages/styles/',
          src: [ '**/*.styl' ],
          dest: 'gh-pages/dev/styles/',
          ext: '.css'
        }]
      },
      prod: {
        options: {
          linenos: false,
          compress: true
        },
        files: [{
          expand: true,
          cwd: 'src/gh-pages/styles/',
          src: [ '**/*.styl' ],
          dest: 'gh-pages/prod/styles/',
          ext: '.css'
        }]
      },
    },
    copy: {
      'vendor-dev': {
        expand: true,
        cwd: 'bower_components/jquery/dist/',
        src: ['jquery.min.js'],
        dest: 'gh-pages/dev/js/',
      },
      'html-dev': {
        expand: true,
        cwd: 'src/gh-pages/',
        src: ['**/*.html'],
        dest: 'gh-pages/dev/',
      },
      'fonts-dev': {
        expand: true,
        cwd: 'src/gh-pages/',
        src: ['fonts/**/*'],
        dest: 'gh-pages/dev/',
      },
      'vendor-prod': {
        expand: true,
        cwd: 'bower_components/jquery/dist/',
        src: ['jquery.min.js'],
        dest: 'gh-pages/prod/js/',
      },
      'html-prod': {
        expand: true,
        cwd: 'src/gh-pages/',
        src: ['**/*.html'],
        dest: 'gh-pages/prod/',
      },
      'fonts-prod': {
        expand: true,
        cwd: 'src/gh-pages/',
        src: ['fonts/**/*'],
        dest: 'gh-pages/prod/',
      },
    }
  });

  grunt.registerTask('copy:dev', ['copy:html-dev', 'copy:fonts-dev', 'copy:vendor-dev']);
  grunt.registerTask('copy:prod', ['copy:html-prod', 'copy:fonts-prod', 'copy:vendor-prod']);
  grunt.registerTask('build:dev', ['copy:dev', 'stylus:dev', 'browserify:dev']);
  grunt.registerTask('build:prod', ['copy:prod', 'stylus:prod', 'browserify:prod']);
  grunt.registerTask('server:dev', ['build:dev', 'connect:dev', 'watch']);
  grunt.registerTask('server:prod', ['build:prod', 'connect:prod', 'watch']);

};