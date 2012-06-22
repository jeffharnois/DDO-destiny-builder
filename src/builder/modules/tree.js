(function(Tree) {

  Tree.Router = Backbone.Router.extend({
    collection: {},
    currentRequest: null,
    models: window.model,
    loadTree: function() {
      var self = this;
      this.currentRequest = new Tree.Views.Test();
      this.currentRequest.render({model: self.models});
    }
  });

  Tree.Collection = Backbone.Collection.extend({/* the collection of models */});

  Tree.Model = Backbone.Model.extend({/* this is the model data structure */});

  
  Tree.Views.Test = Backbone.View.extend({
    el: "body",

    // the name of the template
    templateName: 'tree',
    
    initialize: function() {
      // optional initialize function
    },
    render: function(options) {
      var self = this,
          drac = $.parseJSON(options.model.draconic_incarnation);
      console.log(drac);
      // append the hogan template to the ID
      $(this.el).html(builder.fetchAndRender('embed',{partial: [this.templateName, 'ability'], model: drac}));

      return this;
    }
  });

})(builder.module("tree"));