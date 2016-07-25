'use strict'

angular.
	module('wkStats').
	config(['$locationProvider', '$routeProvider',
		function config($locationProvider, $routeProvider) {
			$locationProvider.hashPrefix('!');

			$routeProvider.
				when('/api-key', {
					template: '<api-key></api-key>'
				}).
				when('/:userKey/navigation', {
					template: '<navigation></navigation>'
				}).
				otherwise('/api-key');
		}
	]);