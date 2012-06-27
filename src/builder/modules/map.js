(function(Map) {

  Map.Router = Backbone.Router.extend({
    loadMap: function() {
      var self = this;
      this.currentRequest = new Map.Views.Test();
      this.currentRequest.render();
    }
  });

  Map.Collection = Backbone.Collection.extend({/* the collection of models */});

  Map.Model = Backbone.Model.extend({/* this is the model data structure */});

  
  Map.Views.Test = Backbone.View.extend({
    el: "body",

    // the name of the template
    templateName: 'map',
    
    initialize: function() {
      // optional initialize function
    },
    render: function(options) {
      var self = this;
      // append the hogan template to the ID
      $(this.el).html(builder.fetchAndRender('embed',{partial: [this.templateName, "footer", "header"], options: {map: "map"}}));

      _gaq.push(['_trackPageview', 'Map']);

      return this;
    }
  });

})(builder.module("map"));