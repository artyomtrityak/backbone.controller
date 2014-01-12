module.exports = function(grunt) {

  grunt.initConfig({

    jshint: {
      options: {
        browser: true,
        globals: {
          requirejs: true,
          console: true
        }
      },
      all: ['Gruntfile.js', 'static/**/*.js', '!**/assets/**']
    },

    karma: {
      test: {
        configFile: 'tests/config.js',
        singleRun: true,
        browsers: ['PhantomJS']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('test', 'runs all test tasks', function() {
    var tasks = ['jshint', 'karma'];
    grunt.option('force', true);
    grunt.task.run(tasks);
  });

  grunt.registerTask('default', ['run']);
};
