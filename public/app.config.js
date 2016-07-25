'use strict'

angular.
	module('wkStats').
	config(['$locationProvider', '$routeProvider',
		function config($locationProvider, $routeProvider) {
			$locationProvider.hashPrefix('!');

			$routeProvider.
				when('/:userKey/navigation', {
					template: '<div class="alert alert-info">Site under development! Pick something up top...</div>'
				}).
				when('/:userKey/levels', {
					template: '<levels></levels>'
				}).
				otherwise('/home');
		}
	]);