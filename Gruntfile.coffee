require('dotenv').load()

module.exports = (grunt) ->
  # load all the grunt tasks
  require('matchdep').filter('grunt-*').forEach grunt.loadNpmTasks

  grunt.initConfig

    regarde: # aka watch
      server:
        files: [
          'Gruntfile.coffee'
          'server.coffee'
        ]
        tasks: [
          'coffeelint:server'
          'coffee:server'
        ]
      client:
        files: [
          'src/**/*.coffee'
        ]
        tasks: [
          'coffeelint:client'
          'coffee:client'
          'concat:app'
        ]

    coffeelint:
      server:
        files:
          src: [
            'server.coffee'
            'Gruntfile.coffee'
          ]
      client:
        files:
          src: [
            'src/builder/**/*.coffee'
          ]

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
            dest: ''
            ext: '.js'
          }
        ]
      client:
        files: [
          {
            expand: true
            flatten: false
            cwd: 'src'
            src: '**/*.coffee'
            dest: 'lib'
            ext: '.js'
          }
        ]

    clean:
      js:
        folder: [
          'public/dist/builder/'
          'public/assets/generated/js'
          'public/assets/img'
        ]
      sass:
        folder: [
          'public/assets/generated/img'
          'public/assets/generated/css'
        ]

    tpl:
      templates:
        options:
          processName: (filename) ->
            filename =
              filename.slice(filename.lastIndexOf('/') + 1, filename.length)
            if filename.indexOf('.') isnt -1
              filename = filename.slice(0, filename.lastIndexOf('.'))
            return filename
        src: [
          'src/builder/templates/**/*.html'
        ]
        dest: 'public/dist/builder/debug/js/templates.js'
      models:
        options:
          processName: (filename) ->
            filename =
              filename.slice(filename.lastIndexOf('/') + 1, filename.length)
            if filename.indexOf('.') isnt -1
              filename = filename.slice(0, filename.lastIndexOf('.'))
            return filename
          namespace: 'model'
        src: [
          'externals/destinies/*.js'
        ]
        dest: 'public/dist/builder/debug/js/model.js'

    concat:
      lib:
        src: [
          'assets/js/libs/jquery/jquery-1.7.1.min.js'
          'assets/js/libs/underscore/underscore.js'
          'assets/js/libs/underscore/keyOf.js'
          'assets/js/libs/backbone/backbone.js'
          'assets/js/libs/backbone/backbone.reset.js'
          'assets/js/libs/hogan.js/hogan.min.js'
          'assets/js/libs/require/require.min.js'
          'assets/js/plugins/**/*.js'
        ]
        dest: 'public/assets/generated/js/libs.js'
      app:
        src: [
          'public/dist/builder/debug/js/templates.js'
          'public/dist/builder/debug/js/model.js'
          'lib/builder/namespace.js'
          'lib/builder/modules/**/*.js'
          'lib/builder/builder.js'
        ]
        dest: 'public/dist/builder/debug/js/app.js'

    uglify:
      files:
        'public/assets/generated/js/libs.js': [
          'public/assets/generated/js/libs.js'
        ]
        'public/dist/builder/release/js/app.js': [
          'public/dist/builder/debug/js/app.js'
        ]
        'public/dist/builder/release/js/templates.js': [
          'public/dist/builder/debug/js/templates.js'
        ]

    compass:
      dist:
        options:
          config: 'assets/config.rb'

    copy:
      files:
        expand: true
        src: ['assets/img/backgrounds/**']
        dest: 'public'

    grunt.registerTask 'supervise', 'Restarts server when changes occur', ->
      require('child_process').spawn(
        'nodemon',
        ['server.js'],
        { stdio: 'inherit' }
      )

    grunt.registerTask 'default', [
      'clean:js'
      'tpl'
      'coffeelint'
      'coffee'
      'concat'
      'uglify'
      'compass'
      'copy'
    ]

    grunt.registerTask 'dev', [
      'clean:js'
      'tpl'
      'coffeelint'
      'coffee'
      'concat'
      'uglify'
      'copy'
    ]

    grunt.registerTask 'watch', [
      'dev'
      'supervise'
      'regarde'
    ]

    grunt.registerTask 'sass', [
      'clean:sass'
      'compass'
    ]
