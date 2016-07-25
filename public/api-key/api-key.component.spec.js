describe('apiKey', function() {

  // Load the module that contains the `apiKey` component before each test
  beforeEach(module('apiKey'));

  // Test the controller
  describe('ApiKeyController', function() {

    it('should create a `test` model with a value of true', inject(function($componentController) {
      var ctrl = $componentController('apiKey');

      expect(ctrl.test).toBe(true);
    }));

  });

});