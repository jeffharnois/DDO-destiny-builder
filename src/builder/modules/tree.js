(function(Tree) {

  Tree.Mapping = {
    "a": "1a",
    "b": "1b",
    "c": "1c",
    "d": "1d",
    "e": "1e",
    "f": "2a",
    "g": "2b",
    "h": "2c",
    "i": "2d",
    "j": "2e",
    "k": "3a",
    "l": "3b",
    "m": "3c",
    "n": "3d",
    "o": "3e",
    "p": "4a",
    "q": "4b",
    "r": "4c",
    "s": "4d",
    "t": "4e",
    "u": "5a",
    "v": "5b",
    "w": "5c",
    "x": "5d",
    "y": "5e",
    "z": "6a",
    "aa": "6b",
    "bb": "6c",
    "cc": "6d",
    "dd": "6e"
  };

  Tree.Router = Backbone.Router.extend({
    collection: {},
    currentRequest: null,
    models: window.model,
    routes: {
      "d/:path":"loadTree"
    },
    initialize: function() {
      var self = this, coll;
      _.each(window.model, function(val, key) {
        v = $.parseJSON(val);
        if (v.dID !== 'base_base') {
          coll = new Tree.Collection(v);
          self.collection[v.dID] = coll;
        }
      });
    },
    loadTree: function(path) {
      var self = this;

      this.currentRequest = new Tree.Views.Tree();
      this.currentRequest.render({collection: self.collection, model: self.collection[path], path: path});
      // console.log('collection path');
      // console.log(self.collection[path]);
      _gaq.push(['_trackPageview', path]);
    }
  });

  Tree.Collection = Backbone.Collection.extend({ });

  Tree.Model = Backbone.Model.extend({/* this is the model data structure */});

  Tree.Views.Tree = Backbone.View.extend({
    el: "body",

    // the name of the template
    templateName: 'tree',
    currentPath: '',
    currentModel: {},
    events: {
      "click .griditem": "clicked",
      "click .reset": "reset",
      "mouseover .griditem": "tooltip",
      "mouseout .griditem": "tooltipOut"
    },
    initialize: function() {
      // optional initialize function
      $(this.el).undelegate();
      this.delegateEvents();
    },
    reset: function(el) {
      var self = this,
          collection = builder.app.tree.collection,
          model = collection[self.currentPath].models[0];
      // TODO: when changed to persist between trees, this will need to be another render
      if ($(el).attr("disabled") === true) {
        return false;
      }
      // window.location.reload();

      // console.log(model._originalAttributes);
      // model.set(model._originalAttributes);
      model.reset();

      console.log(model);
      this.render({collection: collection, path: self.currentPath});

      return true;
    },
    subtracted: function (el) {

      var e = $(el.currentTarget),
          self = this,
          m = self.currentPath,
          i = $(el.currentTarget).attr('class'),
          ranks = parseInt(e.find("a").attr("data-ranks")),
          pSpent = $(".points").find(".spent"),
          pAvail = $(".points").find(".avail"),
          collection = builder.app.tree.collection,
          model = collection[self.currentPath].models[0], 
          img = e.find('.skillimg').attr('classname'),
          skill, selected, desc, req, spent, r,
          reqs = [],
          goodToGo = true;

      // make sure we know what class we have
      if (!i) {
        return false;
      } else {
        i = i.replace("griditem","").replace(" ","");
        skill = model.get(i);
        spent = model.get("points_spent");
      }

      // make sure this isnt an autogrant
      if (e.parent('.gridrow').hasClass('autogrants') === true) {
        return false;
      }

      // check and make sure this has something in it.
      if (el.currentTarget.childNodes.length < 2) {
        return false;
      }

      // prevent the removal if this would drop the user below the minimum points spent for a higher tier (or this tier)
      if ((model.get('points_spent') - skill.AP) < skill.required) {
        return false;
      }
      
      // if this model has required_by, lets check and make sure its fulfilled.
      if (skill.required_by !== null) {
        _.each(skill.required_by, function(elem) {
          elem = elem.replace("griditem","").replace(" ","");
          r = model.get(elem);
          if (r !== null && r.selected >= skill.selected) {
            goodToGo = false;
            return false;
          }
        });
      }

      if (goodToGo === true) {
        // subtract the current AP cost to the points spent
        model.set({points_spent: spent - skill.AP});
        // decriment the skill selected
        skill.selected = skill.selected - 1;
        // add the current AP cost from the points remaining
        model.set({points_remaining: model.get('points_remaining') + skill.AP});
        // re-render the page
        self.render({collection: collection, path: self.currentPath});
      }

      return true;
    },
    clicked: function(el) {
      var e = $(el.currentTarget),
          self = this,
          m = self.currentPath,
          i = $(el.currentTarget).attr('class'),
          ranks = parseInt(e.find("a").attr("data-ranks")),
          pSpent = $(".points").find(".spent"),
          pAvail = $(".points").find(".avail"),
          collection = builder.app.tree.collection,
          model = collection[self.currentPath].models[0], 
          img = e.find('.skillimg').attr('classname'),
          skill, selected, desc, req, spent,
          reqs = [],
          goodToGo = true;

      // make sure we know what class we have
      if (!i) {
        return false;
      } else {
        i = i.replace("griditem","").replace(" ","");
        skill = model.get(i);
        req = skill.prereq;
        spent = model.get("points_spent");
      }
          
      // make sure this isnt an autogrant
      if (e.parent('.gridrow').hasClass('autogrants') === true) {
        return false;
      }
      
      // check and make sure this has something in it.
      if (el.currentTarget.childNodes.length < 2) {
        return false;
      }
      
      // check if required points spent are less than or equal to points spent
      if (skill.required > model.get('points_spent')) {
        return false;
      }
      
      // check if there are enough points available
      if (skill && skill.AP >= model.get('points_remaining')) {
        return false;
      }
      
      // check if the current amount of ranks are less than the total ranks
      if (skill.selected == skill.ranks) {
        return false;
      }
      
      // check if req exists
      if (req !== null) {
        // split at , and throw into an array
        reqs = req.split(",");
        // loop over the array to make sure this isn't a multiple pre-req
        _.each(reqs, function(val, key) {
          // check each pre-req to make sure it's fulfilled
          reqTaken = parseInt($(".grid").find("."+val).find("a").attr("user-selected"));
          if ((parseInt(selected) + 1) > reqTaken) {
            // if not, set goodToGo to false because return false won't be caught correctly in the loop
            goodToGo = false;
            return false;
          }
        });
      }
      
      if (goodToGo === true) {
        // add the current AP cost to the points spent
        model.set({points_spent: spent + skill.AP});
        // increment the skill selected
        skill.selected = skill.selected + 1;
        // subtract the current AP cost from the points remaining
        model.set({points_remaining: model.get('points_remaining') - skill.AP});
        // re-render the page
        self.render({collection: collection, path: self.currentPath});
      }
      
      return true;
    },
    tooltipOut: function() {
      $('.tooltipWrapper').remove();
    },
    tooltip: function(el) {
      var self = this,
          e = $(el.currentTarget).find('a'),
          m = self.currentPath,
          i = $(el.currentTarget).attr('class'),
          collection = builder.app.tree.collection,
          model, skill, selected, desc;

      if (i) {
        i = i.replace("griditem","").replace(" ","");
        skill = collection[self.currentPath].models[0].get(i);
        if (skill) {
          selected = skill.selected;
          desc = skill.abil;
          $('.tooltipWrapper').remove();
          $(el.currentTarget).append('<div class="tooltipWrapper"></div>');
          if (skill !== null) {
            if (desc[selected]) {
              $(".tooltipWrapper").append(builder.fetchAndRender('tooltip', {taken: "Current", required: skill.required, abil: desc[selected], abil_name: skill.abil_name}));
            } 
            if (desc[selected+1]) {
              $(".tooltipWrapper").append(builder.fetchAndRender('tooltip', {taken: "Next", required: skill.required, abil: desc[selected+1], abil_name: skill.abil_name}));
            }
          }
        }
      }
    },
    drawImages: function() {
      var self = this,
          classname;
      $(this.el).find('.griditem').each(function(i, e){
        classname = $(e).find('.skillimg').attr('classname');
        if (classname) {
          $(e).find('.skillimg').addClass(self.currentPath + "-" + classname);
        }
      });
    },
    render: function(options) {
      var self = this,
          collection = options.collection,
          path = options.path;
      self.currentPath = path;
      // append the hogan template to the ID
      $(this.el).html(builder.fetchAndRender('embed',{partial: [this.templateName, 'class', 'ability', 'tooltip', 'autogrant-ability', 'autogrant-tooltip', 'footer', 'header'/*, 'twist', 'twists'*/], collection: collection, model: collection[path], options: {tree: "tree"}}));
      
      $("aside").find("li").removeClass("active");
      $("aside").find("."+path).addClass("active");
      
      $('.griditem').bind('contextmenu', function(e){
        e.preventDefault();
        self.subtracted(e);
        return false;
      });
      
      $('a[data-toggle="tooltip"]', this.el).tooltip({placement: 'right', delay: {show: 200}});

      return this;
    }
  });

})(builder.module("tree"));