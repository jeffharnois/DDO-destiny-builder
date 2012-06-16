module.exports = function(grunt) {

  grunt.initConfig({

    lint: {
      files: ["src/tutorial/config.js", "src/tutorial/**/*.js"]
    },

    clean: {
      folder: "dist/tutorial"
    },

    tpl: {
      // output : source
      "dist/tutorial/debug/js/templates.js": ["src/tutorial/templates/**/*.mustache"]
    },

    concat: {
      // Application files
      "dist/tutorial/debug/js/app.js": [
        "dist/tutorial/debug/js/templates.js",
        "src/tutorial/namespace.js",
        "src/tutorial/modules/**/*.js",
        "src/tutorial/repstream.app.js"
      ]

    },

    min: {
      "dist/tutorial/release/js/app.js": ["dist/tutorial/debug/js/app.js"],
      "dist/tutorial/release/js/templates.js": ["dist/tutorial/debug/js/templates.js"]
    },

    // funky path because we want to include 'Apps' in the memcache key for retrieval by PageRenderer
    memrev: {
      'smarty-artie': ['dist/tutorial/release/js/*.js','dist/tutorial/debug/js/*.js']
    },

    watch: {
      files: ["src/**/*"],
      tasks: "lint:files concat"
    }

  });

  // up 2 directories tutorial -> src
  grunt.file.setBase('../../');

  grunt.loadNpmTasks('grunt-clean');
  grunt.loadNpmTasks('grunt-memrev');
  grunt.loadNpmTasks('grunt-tpl');

  // Run the following tasks...
  grunt.registerTask('default', 'lint:files clean tpl concat min memrev');

};