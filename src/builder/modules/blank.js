(function(Magister) {

  Magister.Router = Backbone.Router.extend({
    routes: {
      // routes go here
      // "secure/myprivacy/protected-data":"getData"
    },
    collection: {},
    currentRequest: null,
    options: {
      // wrapper options
    },
    defaultFunction: function() {
      this.currentRequest = new Magister.Views.Test();
      this.currentRequest.render();
    }
  });

  Magister.Collection = Backbone.Collection.extend({/* the collection of models */});

  Magister.Model = Backbone.Model.extend({/* this is the model data structure */});

  
  Magister.Views.Test = Backbone.View.extend({
    el: "body",

    // the name of the template
    templateName: 'blank',
    
    initialize: function() {
      // optional initialize function
    },
    render: function(options) {
      var self = this;
      
      // append the hogan template to the ID
      $(this.el).html(builder.fetchAndRender('embed',{partial: this.templateName}));

      return this;
    }
  });

})(builder.module("magister"));