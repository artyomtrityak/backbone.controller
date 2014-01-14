var expect = chai.expect;

describe('Backbone.Controller', function(){
  
  it('should export correct controller', function(){
    expect(Backbone.Controller).to.be.a('function');
  });

  it('should have possibility to extend', function() {
    expect(Backbone.Controller.extend).to.be.a('function');
    expect(Backbone.Controller.extend).to.equal(
      Backbone.History.extend
    );
    
    var callback = sinon.stub(),
        params = {name: 'test', param2: 22},
        Controller;

    Controller = Backbone.Controller.extend({
      initialize: callback
    });

    expect(callback.callCount).to.be.equal(0);

    controllerInstance = new Controller(params);
    expect(callback.callCount).to.be.equal(1);
    expect(callback.calledWith(params)).to.be.equal(true);
  });

  it('should have default remove method', function() {
    var Controller = Backbone.Controller.extend({}),
        controllerInstance = new Controller();

    expect(controllerInstance.remove).to.be.a('function');

    sinon.spy(controllerInstance, 'stopListening');
    expect(controllerInstance.stopListening.callCount).to.be.equal(0);
    controllerInstance.remove();
    expect(controllerInstance.stopListening.callCount).to.be.equal(1);

  });
});