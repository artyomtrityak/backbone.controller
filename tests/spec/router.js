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

});