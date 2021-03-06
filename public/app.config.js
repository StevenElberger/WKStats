'use strict'

angular.
    module('wkStats').
    config(['$locationProvider', '$routeProvider',
        function config($locationProvider, $routeProvider) {
            $locationProvider.hashPrefix('!');

            $routeProvider.
                when('/:userKey/home', {
                    template: '<div class="alert alert-info">Site under development! Pick something up top...</div>',
                    activeTab: 'home'
                }).
                when('/:userKey/levels', {
                    template: '<levels></levels>',
                    activeTab:  'levels'
                }).
                when('/:userKey/levelStats', {
                    template: '<level-stats></level-stats>',
                    activeTab: 'levelStats'
                }).
                when('/:userKey/about', {
                    template: '<p>Coming soon!</p>',
                    activeTab: 'about'
                }).
                otherwise({
                    routeTo: '/',
                    activeTab: 'key'
                });
        }
    ]);