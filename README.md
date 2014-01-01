Backbone.Controller
===================

Controller for Backbone MV*
Keep controller logic separated, split your routes to controllers.

Usage examples:

1. Basic

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

2. Controller supports default Backbone events

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

3. Controller has remove method which just does `this.stopListening()`.
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

4. Controller can declarative defien routes
It's little more complex than previous examples but can be used to keep all routes separately
which is good idea for any app.


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
    'dog/:id': 'showDog'
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
