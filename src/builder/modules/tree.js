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
      this.currentRequest.render({collection: collection, model: $.parseJSON(window.model[path]), path: path});
    }
  });

  Tree.Collection = Backbone.Collection.extend({/* the collection of models */});

  Tree.Model = Backbone.Model.extend({/* this is the model data structure */});

  
  Tree.Views.Test = Backbone.View.extend({
    el: "body",

    // the name of the template
    templateName: 'tree',
    currentPath: '',
    currentModel: {},
    currentSpent: 0,
    currentLeft: 24,
    events: {
      "click .griditem": "clicked",
      "click .reset": "reset"
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
      
      return true;
    },
    clicked: function(el) {
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
      
      // check if req exists and if tier exists and is a number
      if (req !== undefined && (reqTier !== undefined || isNaN(reqTier) === false)) {
        reqTaken = parseInt($(".grid").find("."+req).find("a").attr("user-selected"));
        // check to see if they've taken enough of the prereq
        if (reqTaken < reqTier) {
          return false;
        }
      }
      
      taken.text(takenNum+1);
      e.find('a').attr("user-selected",takenNum+1);
      pSpent.text(parseInt(pSpent.text()) + AP);
      pAvail.text(parseInt(pAvail.text()) - AP);
      $('.reset').removeAttr('disabled');
      e.find('.'+img).removeClass(img).addClass(img+"-taken");
      
      // TODO: append the next tier
      // // rebuild the tooltip
      // var model = {};
      // model.abil_name = this.currentModel[ID].abil_name;
      // model.abil = {"1": this.currentModel[ID].abil[parseInt(taken.text()) + 1]};
      // console.log('ranks ' + ranks);
      // model.ranks = ranks;
      // console.log("required " + required);
      // model.required = required;
      // model.selected = parseInt(taken.text());
      // model.AP = AP;
      // model.prereq = {"req": req, "tier": reqTier};
      // console.log('click mmodel');
      // console.log(model);
      // 
      // $(e).find('a').html(builder.fetchAndRender('tooltip',model));
      // $('a[data-toggle="tooltip"]', this.el).tooltip({placement: 'right', delay: {show: 200}});
      
      return true;
    },
    render: function(options) {
      var self = this,
          collection = options.collection,
          model = options.model,
          path = options.path;
      self.currentPath = path;
      self.currentModel = model;
      // append the hogan template to the ID
      $(this.el).html(builder.fetchAndRender('embed',{partial: [this.templateName, 'class', 'ability', 'tooltip', 'footer', 'header'], collection: collection, model: model, options: {tree: "tree"}}));
      
      $("aside").find("li").removeClass("active");
      $("aside").find("."+path).addClass("active");

      $('a[data-toggle="tooltip"]', this.el).tooltip({placement: 'right', delay: {show: 200}});
      
      $('.griditem').bind('contextmenu', function(e){
          e.preventDefault();
          self.subtracted(e);
          return false;
      });
      
      _gaq.push(['_trackPageview', path]);

      return this;
    }
  });

})(builder.module("tree"));