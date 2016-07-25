'use strict'

angular.
	module('navigation').
	component('navigation', {
		templateUrl: 'navigation/navigation.template.html',
		controller: ['$q', '$routeParams',
			function NavigationController($q, $routeParams) {
				var self = this,
					user = WKW.getUser($routeParams.userKey);

				self.userKey = $routeParams.userKey,
				// have to wrap the prommise in $q because of
				// Angular's digest cycle
				$q.when(user.getUserInformation()).then(function(error) {
					self.information = user.user_information;
					if (user.user_information.gravatar) {
						self.gravatar = user.user_information.getAvatar();
					}
				});
			}
		]
	})