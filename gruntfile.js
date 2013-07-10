module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['gruntfile.js', 'app/**/*.js'],
    },
    concat: {
      dist: {
        src: ['app/**/*.js'],
        dest: 'dist/scripts/app.js'
      }
    },
    uglify: {
      options: {
        banner: '// <%= pkg.name %> <%= pkg.version %> \n' +
                '// (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %> \n' +
                '// <%= pkg.repository.url %> \n'
      },
      dist: {
        files: {
          'dist/scripts/app.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    less: {
      compile: {
        options: {
          compress: true
        },
        files: {
          'dist/styles/app.css': 'app/less/*.less'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'less']);

};