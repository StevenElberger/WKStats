'use strict'

angular.
	module('apiKey').
	component('apiKey', {
		templateUrl: 'api-key/api-key.template.html',
		controller: function ApiKeyController() {
			this.test = 'true';
		}
	});