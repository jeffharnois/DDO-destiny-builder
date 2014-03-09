# This contains the module definition factory function, application state,
# events, and the router.

@builder =
  # Assist with code organization, by breaking up logical components of code
  # into modules.
  module: (->
    # Internal module cache.
    modules = {}

    # Create a new module reference scaffold or load an existing module.
    return (name) ->
      # If this module has already been created, return it.
      if (modules[name])
        return modules[name]
      else
         # Create a module and save it under this name
        return modules[name] = { Views: {} }
  )()

  fetchAndRender: (tpl, info) ->
    window.Templates = window.templates or {}

    # make sure that the template has been Templatized
    if Templates[tpl]
      h = Hogan.compile Templates[tpl]
      partial = {}
      if info.partial
        if typeof(info.partial) is 'object'
          partial.partial = Hogan.compile templates[info.partial.shift()]

          for p in info.partial
            partial[p] = Hogan.compile Templates[p]
        else
          partial = {partial: Hogan.compile Templates[info.partial]}
        return h.render info, partial
      else
        return h.render info

  # Keep active application instances namespaced under an app object.
  app: _.extend {}, Backbone.Events
