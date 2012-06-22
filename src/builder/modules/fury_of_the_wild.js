(function(Fury_of_the_Wild) {

  Fury_of_the_Wild.Router = Backbone.Router.extend({
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
      this.currentRequest = new Fury_of_the_Wild.Views.Test();
      this.currentRequest.render();
    }
  });

  Fury_of_the_Wild.Collection = Backbone.Collection.extend({/* the collection of models */});

  Fury_of_the_Wild.Model = Backbone.Model.extend({/* this is the model data structure */});

  
  Fury_of_the_Wild.Views.Test = Backbone.View.extend({
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

})(builder.module("fury_of_the_wild"));