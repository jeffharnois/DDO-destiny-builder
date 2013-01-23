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
      folder: "public/dist/builder/"
    },

    concat: {

      // Library files
      "public/assets/generated/js/libs.js": [
          "assets/js/libs/jquery/jquery-1.7.1.min.js",
          "assets/js/libs/underscore/underscore.js",
          "assets/js/libs/backbone/backbone.js",
          "assets/js/libs/backbone/backbone.reset.js",
          "assets/js/libs/hogan.js/hogan.min.js",
          "assets/js/libs/require/require.min.js",
          "assets/js/plugins/**/*.js"
      ],
      // Application files
      "public/dist/builder/debug/js/app.js": [
        "public/dist/builder/debug/js/templates.js",
        "public/dist/builder/debug/js/model.js",
        "src/builder/namespace.js",
        "src/builder/modules/**/*.js",
        "src/builder/builder.app.js"
      ]
      
    },
    
    tpl: {
      // output : source
      "public/dist/builder/debug/js/templates.js": ["src/builder/templates/**/*.mustache"],
      "public/dist/builder/debug/js/model.js":["externals/destinies/*.js"]
    },

    min: {
      "public/assets/generated/js/libs.js": ["public/assets/generated/js/libs.js"],
      "public/dist/builder/release/js/app.js": ["public/dist/builder/debug/js/app.js"],
      "public/dist/builder/release/js/templates.js": ["public/dist/builder/debug/js/templates.js"]
    },

    watch: {
      files: ["src/**/*"],
      tasks: "lint:files concat"
    }

  });

  grunt.loadNpmTasks('grunt-clean');
  grunt.loadNpmTasks('grunt-tpl');

  grunt.registerTask('default', 'clean tpl concat min');

};
