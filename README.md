Backbone.Controller
===================

[![Build Status](https://travis-ci.org/artyomtrityak/backbone.controller.png)](https://travis-ci.org/artyomtrityak/backbone.controller)
<a href="https://twitter.com/intent/tweet?hashtags=&original_referer=https://github.com/&text=Check+out+Backbone.Controller+for+keeping+controller+logic+separated&tw_p=tweetbutton&url=https://github.com/artyomtrityak/backbone.controller" target="_blank">
  <img src="http://jpillora.com/github-twitter-button/img/tweet.png"></img>
</a>

Controller for Backbone MV*

Keep controller logic separated, split your routes to controllers.

## Usage

DEMO: [Just Test It](https://github.com/artyomtrityak/just-test-it)

Usage examples:

###Basic

```js
var Controller = Backbone.Controller.extend({
  initialize: function() {
    // do init stuff
  },

  search: function(query, page) {
    // create search model and view
  }
}); 

var searchController = new Controller();
```

###Controller supports default Backbone events

```js
var Controller = Backbone.Controller.extend({
  initialize: function() {
    this.model = new Backbone.Model();
    this.listenTo(this.model, 'add', this._onAdd);
  },

  _onAdd: function(model) {
    // show notification view
  }
}); 

var catsController = new Controller();
```

###Controller has remove method for cleanup

Remove method should do correct remove for all controller views and models, stop listening controller events and clear state.

```js
var Controller = Backbone.Controller.extend({
  initialize: function() {
    this.model = new Backbone.Model();
    this.listenTo(this.model, 'add', this._onAdd);
  },

  _onAdd: function(model) {
    // show notification view
  }
}); 

var catsController = new Controller();
//...
catsController.remove();
```

Also remove method is calling automatically when user goes from one controller to another. See routing section for details.

### Controller supports declarative routes definition.

It's little more complex than previous examples but can be used to keep all routes separately
which is good idea for any size app.


```js
var CatsController = Backbone.Controller.extend({
  routes: {
    'cats': 'list',
    'cats/:id': 'showCat'
  },

  initialize: function() {
    // do some init stuff
  },

  list: function() {
    // show cats list
  },

  showCat: function(catId) {
    // show cat view
  }
});

var DogsController = Backbone.Controller.extend({
  routes: {
    '': 'list',
    'dogs': 'list',
    'dogs/:id': 'showDog'
  },

  initialize: function() {
    // do some init stuff
  },

  list: function() {
    // show dogs list
  },

  showDog: function(catId) {
    // show cat view
  },

  remove: functin() {
    // cleanup
  }
});

var Application = Backbone.Router.extend({
  controllers: {},

  initialize: function() {
    this.controllers.cats = new CatsController({router: this});
    this.controllers.dogs = new DogsController({router: this});

    Backbone.history.start();
  }
});
```

The main idea - pass `{router: routerInstance}` as controller option.
This allows to define controller specific routes in separated controllers.

When url changes from `#dogs` / `#dogs/:id` to any route which defined in another controller, remove method is calling automatically.

This case controller should clear state, remove controller specific views and models.

### Controller can automatically add router without creating Backbone.Router instance

```js
var CatsController = Backbone.Controller.extend({
  routes: {
    'cats': 'list',
    'cats/:id': 'showCat'
  },

  initialize: function() {
    // do some init stuff
  },

  list: function() {
    // show cats list
  },

  showCat: function(catId) {
    // show cat view
  }
});

var DogsController = Backbone.Controller.extend({
  routes: {
    '': 'list',
    'dogs': 'list',
    'dogs/:id': 'showDog'
  },

  initialize: function() {
    // do some init stuff
  },

  list: function() {
    // show dogs list
  },

  showDog: function(catId) {
    // show cat view
  }
});

var cats = new CatsController({router: true});
var dogs = new DogsController({router: true});
```

### Before / after routing

Controller automatically calls `onBeforeRoute` / `onAfterRoute` functions when processing routes.

```js
var DogsController = Backbone.Controller.extend({
  routes: {
    '': 'list',
    'dogs': 'list'
  },

  initialize: function() {
    // do some init stuff
  },

  onBeforeRoute: function(url, param1, param2, ...) {
    // called before `#dogs` / `#` routes
    // Set some state variables, create controller layout etc
  },

  onAfterRoute: function(url, param1, param2, ...) {
    // called after `#dogs` / `#` routes
  },

  list: function() {
    // show dogs list
  }
});

var dogs = new DogsController({router: true});


//Cancel route
var DogsController = Backbone.Controller.extend({
  routes: {
    'dogs': 'list',
    'dogs/:id': 'showDog'
  },

  initialize: function() {
    // do some init stuff
  },

  list: function() {
    // show dogs list
  },

  showDog: function(catId) {
    // show cat view
  },
  onBeforeRoute : function(url) {
    console.log('before route');
    var deferred = Q.defer();

    setTimeout(function() {
      deferred.resolve('ggg');
    }, 2000);

    return deferred.promise;
    //return false;
  },
  onAfterRoute : function() {
    console.log('afterRoute');
  }
});

var dogs = new DogsController({router : true});
Backbone.history.start();
```

### Redirecting to another route

If declarative routing has been used in project, you don't have access directly to Router instance.
Backbone Controller provides Controller.navigate method as proxy for Backbone.Router.navigate method.

```js
var DogsController = Backbone.Controller.extend({
  routes: {
    'dogs': 'list'
  },

  list: function() {
    // show dogs list
    // if something
    this.navigate('cats/', {trigger: true});
  }
});

var dogs = new DogsController({router: true});
```

## Dependencies loading

### Require.js AMD

```js
requirejs.config({
  baseUrl: 'static/',
  urlArgs: 'bust=' +  Date.now(),
  paths: {
    jquery: 'assets/js/jquery',
    underscore: 'assets/js/underscore',
    backbone: 'assets/js/backbone',
    controller: 'assets/js/backbone.controller'
  },

  shim: {
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    controller: {
      deps: ['underscore', 'backbone']
    },
    app: ['controller']
  }
});
```

### CommonJS

```js
var Controller = require('controller');
// or require Backbone, both fine

var HomeController = Controller.extend({
  ...
});
```

### Old style

```html
<script src="assets/js/jquery.js" />
<script src="assets/js/underscore.js" />
<script src="assets/js/backbone.js" />
<script src="assets/js/backbone.controller.js" />
```

### Bower

```sh
bower install backbone.controller
```
