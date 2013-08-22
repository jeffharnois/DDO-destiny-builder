module.exports = function(grunt) {

  grunt.initConfig({

    lint: {
      all: ['grunt.js', 'src/builder/**/*.js']
    },

    jshint: {
      options: {
        browser: true
      }
    },

    clean: {
      folder: ["public/dist/builder/", "public/assets/generated", "public/assets/img"]
    },
    
    tpl: {
      templates: {
        options: {
          processName: function(filename) {
            filename = filename.slice(filename.lastIndexOf('/') + 1, filename.length);
            if (filename.indexOf('.') !== -1) {
              filename = filename.slice(0, filename.lastIndexOf('.'));
            }
            return filename;
          }
        },
        src: ["src/builder/templates/**/*.html"],
        dest: "public/dist/builder/debug/js/templates.js"
      },
      models: {
        options: {
          processName: function(filename) {
            filename = filename.slice(filename.lastIndexOf('/') + 1, filename.length);
            if (filename.indexOf('.') !== -1) {
              filename = filename.slice(0, filename.lastIndexOf('.'));
            }
            return filename;
          },
          namespace: 'model'
        },
        dest: "public/dist/builder/debug/js/model.js",
        src: ["externals/destinies/*.js"]
      }
    },

    concat: {
      lib: {
        src: [
          "assets/js/libs/jquery/jquery-1.7.1.min.js",
          "assets/js/libs/underscore/underscore.js",
          "assets/js/libs/underscore/keyOf.js",
          "assets/js/libs/backbone/backbone.js",
          "assets/js/libs/backbone/backbone.reset.js",
          "assets/js/libs/hogan.js/hogan.min.js",
          "assets/js/libs/require/require.min.js",
          "assets/js/plugins/**/*.js"
        ],
        dest: "public/assets/generated/js/libs.js"
      },
      app: {
        src: [
          "public/dist/builder/debug/js/templates.js",
          "public/dist/builder/debug/js/model.js",
          "src/builder/namespace.js",
          "src/builder/modules/**/*.js",
          "src/builder/builder.app.js"
        ],
        dest: "public/dist/builder/debug/js/app.js"
      }
    },

    uglify: {
      files: {
        "public/assets/generated/js/libs.js": ["public/assets/generated/js/libs.js"],
        "public/dist/builder/release/js/app.js": ["public/dist/builder/debug/js/app.js"],
        "public/dist/builder/release/js/templates.js": ["public/dist/builder/debug/js/templates.js"]
      }
    },


    compass: {
      dist: {
        options: {
          config: 'assets/config.rb'
        }
      }
    },

    copy: {
      files: {
        expand: true,
        src: ['assets/img/backgrounds/**'],
        dest: 'public'
      }
    },

    watch: {
      options: {
        spawn: true
      },
      files: ['Gruntfile.js'],
      tasks: ['clean'],
    }

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-tpl');

  grunt.registerTask('default', ['clean', 'tpl', 'concat', 'uglify', 'compass', 'copy']);
  grunt.registerTask('dev', ['clean', 'tpl', 'concat', 'uglify', 'copy']);
  grunt.registerTask('watch', ['watch']);

  grunt.event.on('watch', function(action, filepath) {
    grunt.config(['jshint', 'all'], filepath);
  });

};
