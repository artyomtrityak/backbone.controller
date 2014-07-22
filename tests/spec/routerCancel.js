var expect = chai.expect;

describe('Backbone.Controller async', function() {
	var dogs,
		onAfterRouteQ = sinon.stub();

	before(function(done) {
		var DogsController = Backbone.Controller.extend({
			routes: {
				'dogs': 'list'
			},
			list: function() {},
			onBeforeRoute: function(url) {
				var deferred = Q.defer();

				setTimeout(function() {
					deferred.resolve();
					done();
				}, 1000);

				return deferred.promise;
				//return false;
			},
			onAfterRoute: onAfterRouteQ
		});

		dogs = new DogsController({router: true});
		dogs.navigate('dogs', {trigger: true});
	});

	/* Cancel route navigate */
	it('should cancel routing', function() {
		var onAfterRoute = sinon.stub(),
			Controller = Backbone.Controller.extend({
				routes : {
					test700 : 'test700'
				},
				test700 : function() {},
				onBeforeRoute : function() {
					return false;
				},
				onAfterRoute : onAfterRoute
			}),
			controller = new Controller({router : true});

		controller.navigate('test700', {trigger: true});
		expect(onAfterRoute.callCount).to.be.equal(0);
	});

	it('should fire onAfterRoute', function() {
		var onAfterRoute = sinon.stub(),
			Controller = Backbone.Controller.extend({
				routes : {
				test701 : 'test701'
				},
				test701 : function() {},
				onBeforeRoute : function() {},
				onAfterRoute : onAfterRoute
			}),
			controller = new Controller({router : true});

		expect(Backbone.History.started).to.be.equal(true);

		controller.navigate('test701', {trigger: true});
		expect(onAfterRoute.callCount).to.be.equal(1);
	});

	it('should work with Promise object', function() {
		expect(onAfterRouteQ.callCount).to.be.equal(1);
	});
});
