//     Backbone.Controller 0.1.0
//     (c) Artyom Trityak
//     Backbone.Controller may be freely distributed under the MIT license.
//     For all details and documentation:
//     https://github.com/artyomtrityak/backbone.controller

(function(){

  var root = this, Backbone, _;

  // Using AMD / CommonJS or window.
  if (typeof exports === 'object') {
    Backbone = require('backbone');
    _ = require('underscore');
  } else {
    Backbone = root.Backbone;
    _ = root._;
  }

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
  };

  Backbone.Controller = function(options){
    this.options = options || {};
    if (_.isFunction(this.initialize)){
      this.initialize(this.options);
    }
    if (this.options.router) {
      bindRoutes.call(this, this.options.router)
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

}).call(this);