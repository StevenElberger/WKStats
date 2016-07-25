'use strict'

angular.
	module('apiKey').
	component('apiKey', {
		templateUrl: 'api-key/api-key.template.html',
		controller: ['$scope', '$location',
			function ApiKeyController($scope, $location) {
				var self = this;

				self.userKey = ""; // default

				self.getData = function getData() {
					if (self.userKey) {
						// this should save the user in local storage
						WKW.getUser(self.userKey).
							getUserInformation().then(function(error) {
								// redirect to bring up user information
								$location.path("/" + self.userKey + '/information');
								$scope.$apply();
							});
					}
				};
			}
		]
	});