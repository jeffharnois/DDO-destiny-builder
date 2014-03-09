((Tree) ->
  Tree.Mapping =
    "a": "1a"
    "b": "1b"
    "c": "1c"
    "d": "1d"
    "e": "1e"
    "f": "2a"
    "g": "2b"
    "h": "2c"
    "i": "2d"
    "j": "2e"
    "k": "3a"
    "l": "3b"
    "m": "3c"
    "n": "3d"
    "o": "3e"
    "p": "4a"
    "q": "4b"
    "r": "4c"
    "s": "4d"
    "t": "4e"
    "u": "5a"
    "v": "5b"
    "w": "5c"
    "x": "5d"
    "y": "5e"
    "z": "6a"
    "aa": "6b"
    "bb": "6c"
    "cc": "6d"
    "dd": "6e"

  # because we are using nested models, we need to reset 'selected'
  # manually, the reset() won't get them all.
  resetModelAttrs = (model) ->
    _.each model.attributes, (e) ->
      if e isnt null and e.selected isnt 0
        e.selected = 0

  class TreeRouter extends Backbone.Router
    collection: {}
    currentRequest: null
    models: window.model
    routes:
      'd/:path': 'loadTree'
      'd/:path/s/:skills': 'buildTree'

    initialize: ->
      _.each window.model, (val, key) =>
        v = $.parseJSON val
        # filter out the base model
        if v.dID isnt 'base_base'
          coll = new Backbone.Collection(v)
          @collection[v.dID] = coll
          @

    doReset: (model) ->
      # use the reset function that backbone.reset.js adds
      model.reset()

      resetModelAttrs(model)
      @

    buildTree: (path, skills) ->
      skill = skills.split ','
      r = /\d+/
      n = 0

      model = @collection[path].models[0]

      @doReset model

      _.each skill, (v, k) ->
        num = v.match r
        v = v.replace /[0-9]/g, ""
        curr = Tree.Mapping[v]
        if num isnt null
          n = n + (parseInt(num) * model.get(curr).AP)
          model.get(curr).selected = num
        else
          model.get(curr).selected = 1
          n = n + (1 * model.get(curr).AP)

      model.set 'points_spent': (model.get('points_spent') + n)
      model.set 'points_remaining': (model.get('points_reminaing') - n)

      @loadTree path

    loadTree: (path) ->
      @currentRequest = new Tree.Views.Tree({collection: @collection})
      @currentRequest.render
        collection: @collection
        model: @collection[path]
        path: path

      _gaq.push ['_trackPageview', path]

  class TreeViews extends Backbone.View
    el: 'body'
    templateName: 'tree'
    currentPath: ''
    currentModel: {}
    events:
      "click .griditem": "added"
      "click .reset": "reset"
      "click .save": "save"
      "mouseover .griditem": "tooltip"
      "mouseout .griditem": "tooltipOut"

    initialize: (options) ->
      @collection = options.collection
      @$el.undelegate()
      @delegateEvents()

    reset: (el) ->
      collection = @collection
      model = collection[@currentPath].models[0]

      if $(el).attr('disabled') is true
        return false

      # use the reset function that backbone.reset.js adds
      model.reset()

      resetModelAttrs(model)

      # re-render the collection
      @render collection: collection, path: @currentPath

    stripGridItem: (i) ->
      i.replace('griditem','').replace(' ','')

    subtracted: (ev) ->
      e = $(ev.currentTarget)
      m = @currentPath
      i = e.attr('class')
      ranks = parseInt e.find('a').data('ranks')
      pSpent = $('.points').find('.spent')
      pAvail = $('.points').find('.avail')
      collection = @collection
      model = collection[@currentPath].models[0]
      img = e.find('.skillimg').attr('classname')
      reqs = []
      goodToGo = true

      # make sure we know what class we have
      unless i
        return false
      else
        i = @stripGridItem(i)
        skill = model.get(i)
        spent = model.get('points_spent')

      # make sure this isn't an autogrant
      if e.parent('.gridrow').hasClass('autogrants') is true
        return false

      # check and make sure this has something in it.
      if ev.currentTarget.childNodes.length < 2
        return false

      # prevent the removal if this would drop the user below the
      # minimum points spent for a higher tier (or this tier)
      if (model.get('points_spent') - skill.AP) < skill.required
        return false

      if skill.selected < 1
        return false

      # if this model has required_by, lets check and make sure its fulfilled.
      if skill.required_by isnt null
        _.each skill.required_by, (elem) =>
          elem = @stripGridItem(elem)
          r = model.get(elem)
          if r isnt null and r.selected >= skill.selected
            goodToGo = false
            return false

      if goodToGo is true

        # subtract the current AP cost to the points spent
        model.set(
          points_spent: (spent - skill.AP)
        )
        # decriment the skill selected
        skill.selected = skill.selected - 1
        # add the current AP cost from the points remaining
        model.set(
          points_remaining: (model.get('points_remaining') + skill.AP)
        )
        # re-render the page
        @render
          collection: collection
          path: @currentPath

      return true

    added: (ev) ->
      e = $(ev.currentTarget)
      m = @currentPath
      i = e.attr('class')
      ranks = parseInt e.find('a').data('ranks')
      pSpent = $('.points').find('.spent')
      pAvail = $('.points').find('.avail')
      collection = @collection
      model = collection[@currentPath].models[0]
      img = e.find('.skillimg').attr('classname')
      reqs = []
      goodToGo = true

      # make sure we know what class we have
      unless i
        return false
      else
        i = @stripGridItem(i)
        skill = model.get(i)
        req = skill.prereq
        spent = model.get('points_spent')

      # make sure this isn't an autogrant
      if e.parent('.gridrow').hasClass('autogrants') is true
        return false

      # check and make sure this has something in it.
      if ev.currentTarget.childNodes.length < 2
        return false

      # check if required points spent are less than or equal to points spent
      # prevents having less points in a prereq than the child skill
      if skill.required > model.get('points_spent')
        return false

      # check if there are enough points available
      if skill and skill.AP > model.get('points_remaining')
        return false

      # check if the current amount of ranks are less than the total ranks
      if skill.selected is skill.ranks
        return false

      # check if a prereq exists
      if req isnt null
        # split at , and throw into an array
        reqs = req.split(',')
        # loop over the array to make sure this isn't a multiple pre-req
        _.each reqs, (val, key) ->
          # check each pre-req to make sure it's fulfilled
          reqTaken = model.get(val).selected
          if (skill.selected + 1) > reqTaken
            # preqreq not fulfilled, set goodToGo to false because return false
            # won't be caught correctly in the loop
            goodToGo = false
            return false

      if goodToGo is true
        # add the current AP cost to the points spent
        model.set points_spent: spent + skill.AP
        # increment the skill selected
        skill.selected = skill.selected + 1
        # subtract the current AP cost from the points remaining
        model.set points_remaining: model.get('points_remaining') - skill.AP
        # re-render the page
        @render
          collection: collection
          path: @currentPath

      return true

    save: ->
      mapping = Tree.Mapping
      collection = @collection
      model = collection[@currentPath].models[0]
      skill = []

      _.each model.attributes, (v, k) ->
        if v isnt null and v.selected and v.selected isnt 0
          curr = _.keyOf(mapping, k)
          if v.selected > 1
            num = v.seleected
            skill.push curr + v.selected
          else
            skill.push curr

      url = skill
      builder.app.navigate "d/#{@currentPath}/s/#{url}"

      @doConfirm()

    doConfirm: ->
      prompt "Copy this: #{window.location}"
      return false

    tooltipOut: ->
      $('.tooltipWrapper').remove()

    tooltip: (ev) ->
      e = $(ev.currentTarget).find('a')
      m = @currentPath
      i = $(ev.currentTarget).attr('class')
      collection = @collection

      if i
        i = @stripGridItem(i)
        skill = collection[@currentPath].models[0].get(i)
        if skill
          selected = skill.selected
          desc = skill.abil
          $('.tooltipWrapper').remove()
          $(ev.currentTarget).append('<div class="tooltipWrapper"></div>')
          if skill isnt null
            if desc[selected]
              $('.tooltipWrapper').append(
                builder.fetchAndRender(
                  'tooltip',
                  {
                    taken: 'Current'
                    required: skill.required
                    abil: desc[selected]
                    abil_name: skill.abil_name
                  }
                )
              )
            if desc[selected + 1]
              $('.tooltipWrapper').append(
                builder.fetchAndRender(
                  'tooltip',
                  {
                    taken: 'Next'
                    required: skill.required
                    abil: desc[selected + 1]
                    abil_name: skill.abil_name
                  }
                )
              )

    drawImages: ->
      @$el.find('.griditem').each (i, e) ->
        classname = $(e).find('.skillimg').attr('classname')
        if classname
          $(e).find('.skillimg').addClass("#{@currentPath}-#{classname}")

    render: (options) ->
      collection = options.collection
      path = options.path

      @currentPath = path
      # append the hogan template to the ID
      @$el.html(
        builder.fetchAndRender(
          'embed',
          {
            partial: [
              @templateName
              'class'
              'ability'
              'tooltip'
              'autogrant-ability'
              'autogrant-tooltip'
              'footer'
              'header'
              # 'twist'
              # 'twists'
            ]
            collection: collection
            model: collection[path]
            options:
              { tree: 'tree' }
          }
        )
      )

      $('aside').find('li').removeClass('active')
      $('aside').find(".#{path}").addClass('active')

      $('.griditem').bind('contextmenu', (e) =>
        e.preventDefault()
        @subtracted(e)
        return false
      )

      $('a[data-toggle="tooltip"]', this.el).tooltip(
        placement: 'right'
        delay: {show: 200}
      )
      return this

  Tree.Router = TreeRouter
  Tree.Views.Tree = TreeViews

)(builder.module('tree'))
