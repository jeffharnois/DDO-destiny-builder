// This contains the module definition factory function, application state,
// events, and the router.
this.builder = {
  // Assist with code organization, by breaking up logical components of code
  // into modules.
  module: function() {
    // Internal module cache.
    var modules = {};

    // Create a new module reference scaffold or load an existing module.
    return function(name) {
      // If this module has already been created, return it.
      if (modules[name]) {
        return modules[name];
      }

      // Create a module and save it under this name
      return modules[name] = { Views: {} };
    };
  }(),
  
  fetchAndRender: function(tpl,info) {
    console.log('fetchAndRender',tpl,info);
    window.Templates = window.templates || {};

    // make sure that the template has been Templatized
    if (Templates[tpl]) {
      console.log('has tpl:',tpl);
      var h = Hogan.compile(Templates[tpl]);
      var partial = {};
      if (info.partial) {
        if (typeof(info.partial) === 'object') {
          partial.partial = Hogan.compile(Templates[info.partial.shift()]);
          for (var i in info.partial) {
            partial[info.partial[i]] = Hogan.compile(Templates[info.partial[i]]);
          }
        } else {
          partial = {partial: Hogan.compile(Templates[info.partial])};
        }
        return h.render(info,partial);
      } else {
        return h.render(info);
      }
    }
  },
  
  // Keep active application instances namespaced under an app object.
  app: _.extend({}, Backbone.Events)
};