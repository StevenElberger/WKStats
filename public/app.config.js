'use strict'

angular.
    module('wkStats').
    config(['$locationProvider', '$routeProvider',
        function config($locationProvider, $routeProvider) {
            $locationProvider.hashPrefix('!');

            $routeProvider.
                when('/:userKey/navigation', {
                    template: '<div class="alert alert-info">Site under development! Pick something up top...</div>',
                    activeTab: 'home'
                }).
                when('/:userKey/levels', {
                    template: '<levels></levels>',
                    activeTab:  'levels'
                }).
                otherwise({
                    routeTo: '/',
                    activeTab: 'home'
                });
        }
    ]);