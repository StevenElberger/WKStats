'use strict'

angular.
	module('apiKey').
	component('apiKey', {
		templateUrl: 'api-key/api-key.template.html',
		controller: ['$q', '$location',
			function ApiKeyController($q, $location) {
				var self = this;

				self.userKey = ""; // default

				self.getData = function getData() {
					if (self.userKey) {
						// this should save the user in local storage
						var user = WKW.getUser(self.userKey);
						$q.when(user.getUserInformation()).then(function(error) {
							// redirect
							$location.path('/' + self.userKey + '/navigation');
						});
					}
				};
			}
		]
	});