'use strict';
module.exports = function(grunt) {
grunt.loadNpmTasks('grunt-typescript');

grunt.initConfig({
typescript: {
    base: {
      src: ['*.ts'],
      dest: '.',
      options: {
        module: 'amd'
      }      
    }
  }
});

grunt.registerTask('default', ['typescript']);

}
