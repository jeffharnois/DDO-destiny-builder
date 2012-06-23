// Treat the jQuery ready function as the entry point to the application.
// Inside this function, kick-off all initialization, everything up to this
// point should be definitions.
jQuery(function($) {
  var app = builder.app;

  // define all the possible modules
  var Tree = builder.module("tree"),
      Map = builder.module("map");

  // Defining the application router
  builder.Router = Backbone.Router.extend({
    routes: {
      "*splat":"loadMap"
    },

    initialize: function() {
      this.tree         = new Tree.Router();
      this.map          = new Map.Router();
    },
    
    loadMap: function(splat) {
      var self = this;

      self.map.loadMap();
    }
  });

  // Define the master router on the application namespace and trigger all
  // navigation from this instance.
  builder.app = new builder.Router();

  // Trigger the initial route
  Backbone.history.start({ pushState: false });

  // All navigation that is relative should be passed through the navigate
  // method, to be processed by the router.  If the link has a data-bypass
  // attribute, bypass the delegation completely.
  $(document).on("click", "a:not([data-bypass])", function(evt) {
    // Get the anchor href and protcol
    var href = $(this).attr("href");
    var protocol = this.protocol + "//";

    // Ensure the protocol is not part of URL, meaning its relative.
    if (href && href.slice(0, protocol.length) !== protocol) {
      // Stop the default event to ensure the link will not cause a page
      // refresh.
      evt.preventDefault();

      // This uses the default router defined above, and not any routers
      // that may be placed in modules.  To have this work globally (at the
      // cost of losing all route events) you can change the following line
      // to: Backbone.history.navigate(href, true);
      if ($(this).attr('data-silent') === true) {
        builder.app.navigate(href, {trigger: true, replace: true});
      } else {
        builder.app.navigate(href, true);
      }
    }
  });
});
