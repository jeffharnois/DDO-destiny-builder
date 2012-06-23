(function(Tree) {

  Tree.Router = Backbone.Router.extend({
    collection: {},
    currentRequest: null,
    models: window.model,
    routes: {
      "d/:path":"loadTree"
    },
    loadTree: function(path) {
      var self = this,
          models = [
            "draconic_incarnation",
            "exalted_angel",
            "fatesinger",
            "fury_of_the_wild",
            "grandmaster_of_flowers",
            "legendary_dreadnought",
            "magister",
            "shadowdancer",
            "shiradi_champion",
            "unyielding_sentinel"
          ], 
          collection = [];
      _.each(window.model, function(val,key) {
        if ($.inArray(key, models) !== -1) {
          collection.push($.parseJSON(val));
        }
      });
      this.currentRequest = new Tree.Views.Test();
      this.currentRequest.render({collection: collection, model: $.parseJSON(window.model[path])});
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
          collection = options.collection,
          model = options.model;
      // append the hogan template to the ID
      $(this.el).html(builder.fetchAndRender('embed',{partial: [this.templateName, 'class', 'ability', 'tooltip'], collection: collection, model: model}));

      return this;
    }
  });

})(builder.module("tree"));