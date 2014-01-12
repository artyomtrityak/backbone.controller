var expect = chai.expect,
    router;

describe('Backbone.Controller routes', function(){

  before(function() {
    Backbone.history.start();
  })

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

    callback = sinon.stub()

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

    callback = sinon.stub()

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

  it('should work correct with many controllers', function() {
    var Controller1, controllerIns1, callback1,
        Controller2, controllerIns2, callback2;

    callback1 = sinon.stub()
    callback2 = sinon.stub()

    Controller1 = Backbone.Controller.extend({
      routes: {
        'test3/': 'method1'
      },
      method1: callback1
    });

    Controller2 = Backbone.Controller.extend({
      routes: {
        'test4/': 'method1'
      },
      method1: callback2
    });

    controllerIns1 = new Controller1({router: true});
    controllerIns2 = new Controller2({router: true});

    expect(callback1.callCount).to.be.equal(0);
    router.navigate('test3/', {trigger: true});
    expect(callback1.callCount).to.be.equal(1);

    expect(callback2.callCount).to.be.equal(0);
    router.navigate('test4/', {trigger: true});
    expect(callback1.callCount).to.be.equal(1);
  });

});