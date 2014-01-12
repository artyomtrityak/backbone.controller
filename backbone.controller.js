//     Backbone.Controller 0.3.0
//     (c) Artyom Trityak
//     Backbone.Controller may be freely distributed under the MIT license.
//     For all details and documentation:
//     https://github.com/artyomtrityak/backbone.controller

(function(root, factory) {

  // Set up Backbone.Controller appropriately for the environment. Start with AMD.
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone', 'exports'], function(_, Backbone, exports) {
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global Backbone.
      root.Backbone.Controller = factory(root, exports, _, Backbone);
      return root.Backbone.Controller;
    });

  // Next for Node.js or CommonJS.
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore'),
        Backbone = require('Backbone');
    factory(root, exports, _, Backbone);

  // Finally, as a browser global.
  } else {
    root.Backbone.Controller = factory(root, {}, root._, root.Backbone);
  }

}(this, function(root, exports, _, Backbone) {

  // Binds your routes to Backbone router.
  // Allows define routes separated in each controller.
  // For example:
  //
  //  Backbone.Controller.extend({
  //    routes: {
  //      '': 'index',
  //      'cat/:query/p:page': 'showCat'
  //    },
  //
  //    initialize: function() {
  //      // do init stuff
  //    },
  //
  //    index: function() {
  //      // create index model and view
  //    },
  //
  //    showCat: function(query, page) {
  //      // create cat model and view
  //    }
  //  });
  //
  //  For router initialization router option should be given.
  //  For example:
  //
  //  var Application = Backbone.Router.extend({
  //    controllers: {},
  //
  //    initialize: function() {
  //      this.controllers.home = new HomeController({router: this});
  //      this.controllers.search = new SearchController({router: this});
  //
  //      Backbone.history.start();
  //    }
  //  });
  //   
  var bindRoutes = function(Router) {
    for (var url in this.routes) {
      var methodName = this.routes[url];
      // Using default Backbone.js route method.
      // Same URLs from different controllers are not allowed.
      // Last controller with same URL will be used.
      Router.route(url, url, _.bind(this[methodName], this));
    }
  },
  cachedRouter;

  Backbone.Controller = function(options){
    this.options = options || {};
    if (_.isFunction(this.initialize)){
      this.initialize(this.options);
    }
    if (this.options.router === true) {
      cachedRouter = cachedRouter || new Backbone.Router();
      this.options.router = cachedRouter;
    }
    if (this.options.router) {
      bindRoutes.call(this, this.options.router);
    }
  };
  
  Backbone.Controller.extend = Backbone.History.extend;
  
  // Supporting default Backbone events like on, off, trigger, listenTo etc
  // Provides remove method which can be called on controller removal.
  _.extend(Backbone.Controller.prototype, Backbone.Events, {
    remove: function() {
      this.stopListening();
    }
  });

  return Backbone.Controller;

}));