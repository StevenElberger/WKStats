'use strict'

angular.
	module('userInformation').
	component('userInformation', {
		templateUrl: 'user-information/user-information.template.html',
		controller: ['$scope', '$routeParams',
			function UserInformationController($scope, $routeParams) {
				var self = this,
					user = WKW.getUser($routeParams.userKey);
				user.getUserInformation().then(function(error) {
					self.information = user.user_information;
					$scope.$apply();
				});
			}
		]
	})