var expect = chai.expect,
    router;

describe('Backbone.Controller routes', function(){

  before(function() {
    Backbone.history.start();
  });

  beforeEach(function() {
    router = new Backbone.Router();
    sinon.spy(router, 'route');
  });

  afterEach(function() {
    router.route.restore();
  });
  
  it('should not bind routes without config', function(){    
    var Controller = Backbone.Controller.extend({
          routes: {
            'test': 'method1'
          }
        }),
        controllerIns = new Controller(),
        controllerIns2 = new Controller();

    expect(router.route.callCount).to.be.equal(0);
    expect(router.route.callCount).to.be.equal(0);
  });

  it('should bind routes with router option', function() {
    var Controller, controllerIns, callback;

    callback = sinon.stub();

    Controller = Backbone.Controller.extend({
      routes: {
        'test/': 'method1'
      },
      method1: callback
    });

    expect(router.route.callCount).to.be.equal(0);
    controllerIns = new Controller({router: router});
    expect(router.route.callCount).to.be.equal(1);

    expect(router.route.calledWith('test/', 'test/')).to.be.equal(true);

    router.navigate('test/', {trigger: true});
    
    expect(callback.callCount).to.be.equal(1);
  });

  it('should support auto router', function() {
    var Controller, controllerIns, callback;

    callback = sinon.stub();

    Controller = Backbone.Controller.extend({
      routes: {
        'test2/': 'method1'
      },
      method1: callback
    });

    controllerIns = new Controller({router: true});

    router.navigate('test2/', {trigger: true});
    expect(callback.callCount).to.be.equal(1);
  });

  it('should work correct with many controllers and call remove', function() {
    var Controller1, controllerIns1, callback1, remove1,
        Controller2, controllerIns2, callback2, remove2;

    callback1 = sinon.stub();
    remove1 = sinon.stub();
    callback2 = sinon.stub();
    remove2 = sinon.stub();

    Controller1 = Backbone.Controller.extend({
      routes: {
        'test3/': 'method1',
        'test31/': 'method2'
      },
      method1: callback1,
      method2: function(){},
      remove: remove1
    });

    Controller2 = Backbone.Controller.extend({
      routes: {
        'test4/': 'method1'
      },
      method1: callback2,
      remove: remove2
    });

    controllerIns1 = new Controller1({router: true});
    controllerIns2 = new Controller2({router: true});

    expect(callback1.callCount).to.be.equal(0);
    expect(remove1.callCount).to.be.equal(0);
    expect(remove2.callCount).to.be.equal(0);

    router.navigate('test3/', {trigger: true});

    expect(callback1.callCount).to.be.equal(1);
    expect(remove1.callCount).to.be.equal(0);
    expect(remove2.callCount).to.be.equal(0);
    expect(callback2.callCount).to.be.equal(0);

    router.navigate('test31/', {trigger: true});

    expect(remove1.callCount).to.be.equal(0);
    expect(remove2.callCount).to.be.equal(0);

    router.navigate('test4/', {trigger: true});

    expect(callback1.callCount).to.be.equal(1);
    expect(remove1.callCount).to.be.equal(1);
    expect(remove2.callCount).to.be.equal(0);

    router.navigate('test3/', {trigger: true});

    expect(remove2.callCount).to.be.equal(1);

    router.navigate('test31/', {trigger: true});

    expect(remove2.callCount).to.be.equal(1);
    expect(remove1.callCount).to.be.equal(1);
  });

  it('should support before/after', function() {
    var Controller, controllerIns, beforeCallback, afterCallback, callback;

    beforeCallback = sinon.stub();
    afterCallback = sinon.stub();
    callback = sinon.stub();

    Controller = Backbone.Controller.extend({
      routes: {
        'test5/': 'method1',
        'test5/:id': 'method1'
      },
      method1: callback,
      onBeforeRoute: beforeCallback,
      onAfterRoute: afterCallback
    });

    controllerIns = new Controller({router: true});

    expect(beforeCallback.callCount).to.be.equal(0);
    expect(afterCallback.callCount).to.be.equal(0);
    expect(beforeCallback.calledWith('test5/')).to.be.equal(false);
    expect(afterCallback.calledWith('test5/')).to.be.equal(false);

    router.navigate('test5/', {trigger: true});

    expect(callback.callCount).to.be.equal(1);
    expect(beforeCallback.callCount).to.be.equal(1);
    expect(afterCallback.callCount).to.be.equal(1);

    expect(beforeCallback.calledWith('test5/')).to.be.equal(true);
    expect(afterCallback.calledWith('test5/')).to.be.equal(true);

    router.navigate('test5/24', {trigger: true});

    expect(beforeCallback.calledWith('test5/:id', '24')).to.be.equal(true);
    expect(afterCallback.calledWith('test5/:id', '24')).to.be.equal(true);
    expect(callback.calledWith('24')).to.be.equal(true);
  });

  it('should support navigate', function() {
    var Controller, controllerIns, callback1, callback2;

    callback1 = sinon.stub();
    callback2 = sinon.stub();

    Controller = Backbone.Controller.extend({
      routes: {
        'test6/': 'method1',
        'test7/': 'method2'
      },
      method1: callback1,
      method2: callback2
    });

    controllerIns = new Controller({router: true});

    expect(controllerIns.navigate).to.be.a('function');
    expect(callback1.callCount).to.be.equal(0);
    expect(callback2.callCount).to.be.equal(0);

    controllerIns.navigate('test6/');

    expect(callback1.callCount).to.be.equal(0);
    expect(callback2.callCount).to.be.equal(0);

    controllerIns.navigate('test7/', {trigger: true});

    expect(callback1.callCount).to.be.equal(0);
    expect(callback2.callCount).to.be.equal(1);

    controllerIns.navigate('test6/', {trigger: true});

    expect(callback1.callCount).to.be.equal(1);
    expect(callback2.callCount).to.be.equal(1);
  });
});