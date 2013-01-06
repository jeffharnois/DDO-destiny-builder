(function(Tree) {

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

      console.log(self.collection);
      this.currentRequest = new Tree.Views.Tree();
      this.currentRequest.render({collection: self.collection, model: self.collection[path], path: path});
    }
  });

  Tree.Collection = Backbone.Collection.extend({
    
  });

  Tree.Model = Backbone.Model.extend({/* this is the model data structure */});

  
  Tree.Views.Tree = Backbone.View.extend({
    el: "body",

    // the name of the template
    templateName: 'tree',
    currentPath: '',
    currentModel: {},
    currentSpent: 0,
    currentLeft: 24,
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
      // TODO: when changed to persist between trees, this will need to be another render
      if ($(el).attr("disabled") === true) {
        return false;
      }
      window.location.reload();
      return true;
    },
    subtracted: function (el) {
      var e = $(el.currentTarget),
          selected = e.find("a").attr("user-selected"),
          AP = parseInt(e.find("a").attr("data-points")),
          ranks = parseInt(e.find("a").attr("data-ranks")),
          required = parseInt(e.find("a").attr("data-required")),
          req = e.find("a").attr("data-req"),
          reqTier = parseInt(e.find("a").attr("data-req-tier")),
          classes = e.attr('class'),
          ids = classes.replace("griditem",""),
          ID = ids.replace(" ",""),
          taken = e.find("span"),
          takenNum = parseInt(taken.text()),
          pSpent = $(".points").find(".spent"),
          pAvail = $(".points").find(".avail"),
          img = e.find('.skillimg').attr('classname');
          
      // make sure this isnt an autogrant
      if (e.parent('.gridrow').hasClass('autogrants') === true) {
        return false;
      }
      
      // check and make sure this has something in it.
      if (el.currentTarget.childNodes.length < 2) {
        return false;
      }
          
      if (parseInt(selected) === 1) {
        e.find('.'+img+'-taken').removeClass(img+'-taken').addClass(img);
      } else if (parseInt(selected) === 0) {
        return false;
      }

      // TODO: check if anything has "this" as a prereq and prevent if so
      // TODO: prevent the removal if this would drop the user below the minimum points spent for a higher tier (or this tier)
      
      taken.text(takenNum-1);
      e.find('a').attr("user-selected",takenNum-1);
      pSpent.text(parseInt(pSpent.text()) - AP);
      pAvail.text(parseInt(pAvail.text()) + AP);
      
      if (parseInt(pSpent.text()) === 0) {
        $('.reset').attr('disabled',"disabled");
      }
      this.tooltip(el);
      
      return true;
    },
    clicked: function(el) {
      var e = $(el.currentTarget),
          selected = e.find("a").attr("user-selected"),
          AP = parseInt(e.find("a").attr("data-points")),
          ranks = parseInt(e.find("a").attr("data-ranks")),
          required = parseInt(e.find("a").attr("data-required")),
          req = e.find("a").attr("data-req"),
          classes = e.attr('class'),
          ids = classes.replace("griditem",""),
          ID = ids.replace(" ",""),
          taken = e.find("span"),
          takenNum = parseInt(taken.text()),
          pSpent = $(".points").find(".spent"),
          pAvail = $(".points").find(".avail"),
          img = e.find('.skillimg').attr('classname'),
          goodToGo = true;
          
      // make sure this isnt an autogrant
      if (e.parent('.gridrow').hasClass('autogrants') === true) {
        return false;
      }
      
      // check and make sure this has something in it.
      if (el.currentTarget.childNodes.length < 2) {
        return false;
      }
      
      // check if required points spent are less than or equal to points spent
      if (required > parseInt(pSpent.text())) {
        return false;
      }
      
      // check if there are enough points available
      if (AP > parseInt(pAvail.text())) {
        return false;
      }
      
      // check if the current amount of ranks are less than the total ranks
      if (ranks == taken.text()) {
        return false;
      }
      
      // check if req exists
      if (req !== undefined && req !== '') {
        // split at , and throw into an array
        var reqs = [];
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
        taken.text(takenNum+1);
        e.find('a').attr("user-selected",takenNum+1);
        pSpent.text(parseInt(pSpent.text()) + AP);
        pAvail.text(parseInt(pAvail.text()) - AP);
        $('.reset').removeAttr('disabled');
        e.find('.'+img).removeClass(img).addClass(img+"-taken");
        this.tooltip(el);
      }
      
      return true;
    },
    tooltipOut: function() {
      $('.tooltipWrapper').remove();
    },
    tooltip: function(el) {
      // var model = {},
      //     e = $(el.currentTarget).find('a'),
      //     AP = parseInt(e.attr("data-points")),
      //     taken = parseInt(e.attr("user-selected")),
      //     classes = $(el.currentTarget).attr('class'),
      //     ids = classes.replace("griditem",""),
      //     ID = ids.replace(" ",""),
      //     required = parseInt(e.attr("data-ranks"));
      // $('.tooltipWrapper').remove();
      //   if (!(isNaN(required))) {
      //     $(el.currentTarget).append('<div class="tooltipWrapper"></div>');
      //     if (this.currentModel[ID].abil[taken]) {
      //       $(".tooltipWrapper").append(builder.fetchAndRender('tooltip', {taken: "Current", required: this.currentModel[ID].required, abil: this.currentModel[ID].abil[taken], abil_name: this.currentModel[ID].abil_name}));
      //     }
      //     if (this.currentModel[ID].abil[taken+1]) {
      //       $(".tooltipWrapper").append(builder.fetchAndRender('tooltip', {taken: "Next", required: this.currentModel[ID].required, abil: this.currentModel[ID].abil[taken+1], abil_name: this.currentModel[ID].abil_name}));

      //     }
      //   }
      var self = this,
          e = $(el.currentTarget).find('a'),
          m = self.currentPath,
          i = $(el.currentTarget).attr('class'),
          collection = builder.app.tree.collection,
          model,
          skill, selected;

      if (i) {
        i = i.replace("griditem","").replace(" ","");
        console.log(i);
        console.log(collection);
        skill = collection[self.currentPath].models[0].get(i);
        console.log(skill);
        $('.tooltipWrapper').remove();
        $(el.currentTarget).append('<div class="tooltipWrapper"></div>');
        // if (this.currentModel[ID].abil[taken]) {
        //   $(".tooltipWrapper").append(builder.fetchAndRender('tooltip', {taken: "Current", required: this.currentModel[ID].required, abil: this.currentModel[ID].abil[taken], abil_name: this.currentModel[ID].abil_name}));
        // }
        // if (this.currentModel[ID].abil[taken+1]) {
        //   $(".tooltipWrapper").append(builder.fetchAndRender('tooltip', {taken: "Next", required: this.currentModel[ID].required, abil: this.currentModel[ID].abil[taken+1], abil_name: this.currentModel[ID].abil_name}));
        // }
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

      this.drawImages();
      
      $('a[data-toggle="tooltip"]', this.el).tooltip({placement: 'right', delay: {show: 200}});
      
      _gaq.push(['_trackPageview', path]);

      return this;
    }
  });

})(builder.module("tree"));