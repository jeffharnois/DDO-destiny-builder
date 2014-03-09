((Map) ->
  class MapViews extends Backbone.View
    el: 'body'
    templateName: 'map'
    render: (options) ->
      @$el.html(builder.fetchAndRender(
        'embed'
        {
          partial: [
            @templateName
            'footer'
            'header'
          ]
          options:
            map: 'map'
        }
      ))

      _gaq.push ['_trackPageview', 'Map']

      @

  class MapRouter extends Backbone.Router
    loadMap: ->
      @currentRequest = new Map.Views.Test
      @currentRequest.render()

  Map.Views.Test = MapViews
  Map.Router = MapRouter

)(builder.module('map'))
