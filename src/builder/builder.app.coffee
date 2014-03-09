# Treat the jQuery ready function as the entry point to the application.
# Inside this function, kick-off all initialization, everything up to this
# point should be definitions.
jQuery ($) ->
  app = builder.app

  Tree = builder.module 'tree'
  Map = builder.module 'map'

  class BuilderRouter extends Backbone.Router
    routes:
      '*splat': 'loadMap'

    initialize: ->
      @tree = new Tree.Router()
      @map  = new Map.Router()

    loadMap: (splat) ->
      @map.loadMap()

  # Define the master router on the application namespace and trigger all
  # navigation from this instance.
  builder.app = new BuilderRouter()

  # Trigger the initial route
  Backbone.history.start({pushState: false})

  # All navigation that is relative should be passed through the navigate
  # method, to be processed by the router.  If the link has a data-bypass
  # attribute, bypass the delegation completely.
  $(document).on('click', 'a:not([data-bypass])', (evt) ->
    # Get the anchor href and protcol
    href = $(@).attr 'href'
    protocol = @protocol + '//'

    # Ensure the protocol is not part of URL, meaning its relative.
    if href and href.slice(0, protocol.length) isnt protocol
      # Stop the default event to ensure the link will not cause a page
      # refresh.
      evt.preventDefault()

      # This uses the default router defined above, and not any routers
      # that may be placed in modules.  To have this work globally (at the
      # cost of losing all route events) you can change the following line
      # to: Backbone.history.navigate(href, true);
      if $(@).data('silent') is true
        builder.app.navigate(href, {trigger: true, replace: true})
      else
        builder.app.navigate(href, true)
  )

