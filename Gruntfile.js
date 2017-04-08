module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.loadNpmTasks('grunt-execute');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.initConfig({

    clean: ["dist"],

    copy: {
      src_to_dist: {
        cwd: 'src',
        expand: true,
        src: ['*.js', 'partials/*.html', 'css/*.css'],
        dest: 'dist'
      },
      pluginDef: {
        expand: true,
        src: ['plugin.json', 'README.md', 'img/*'],
        dest: 'dist'
      }
    },

    babel: {
      options: {
        sourceMap: true,
        presets: ["es2015"]
      },
      dist: {
        options: {
          plugins: ['transform-es2015-modules-systemjs', 'transform-es2015-for-of']
        },
        files: [{
          cwd: 'src',
          expand: true,
          src: ['**/*.ts'],
          dest: 'dist',
          ext: '.js'
        }]
      },
    },

  });

  grunt.registerTask('default', [
    'clean',
    'copy:src_to_dist',
    'copy:pluginDef',
    'babel'
  ]);

  grunt.registerTask('test', ['default']);
};
