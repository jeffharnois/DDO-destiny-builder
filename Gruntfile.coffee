require('dotenv').load()

module.exports = (grunt) ->
  # load all the grunt tasks
  require('matchdep').filter('grunt-*').forEach grunt.loadNpmTasks

  grunt.initConfig

    regarde: # aka watch
      coffeelint:
        files: [

        ]
        tasks: [

        ]
      coffee:
        files: [

        ]
        tasks: [

        ]
      sass:
        files: [

        ]
        tasks: [

        ]


    coffelint

    coffee:
      options:
        bare: true
        sourceMap: false # change to true for debugging
        sourceRoot: "."
      server:
        files: [
          {
            expand: true
            flatten: false
            src: 'server.coffee'
            dest: '/'
            ext: '.js'
          }
        ]

    sass

