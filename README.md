Backbone.Controller
===================

[![Build Status](https://travis-ci.org/artyomtrityak/backbone.controller.png)](https://travis-ci.org/artyomtrityak/backbone.controller)

Controller for Backbone MV*

Keep controller logic separated, split your routes to controllers.

## Usage

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

###Controller has remove method which just does `this.stopListening()`.
On remove method controller should make correct remove for all controller views and models.
Feel free to redefine it.

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
delete catsController;
```

4) Controller supports declarative routes definition.

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

### Old style

```html
<script src="assets/js/jquery.js" />
<script src="assets/js/underscore.js" />
<script src="assets/js/backbone.js" />
<script src="assets/js/backbone.controller.js" />
```