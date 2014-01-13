module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      options: {
        browser: true,
        globals: {
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

  grunt.registerTask('test', ['jshint', 'karma']);
  grunt.registerTask('default', ['test']);
};
