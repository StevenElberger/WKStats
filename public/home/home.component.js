'use strict'

angular.
    module('home').
    component('home', {
        templateUrl: 'home/home.template.html',
        controller: ['$q', '$scope', '$route', '$routeParams', '$location',
            function HomeController($q, $scope, $route, $routeParams, $location) {
                var self = this;

                // keep track of route for active tabs
                $scope.$route = $route;
                // defaults
                self.path = "";
                self.userKey = "";
                if ($route.current && 
                    $route.current.activeTab && 
                    $route.current.activeTab !== "key") {
                    self.path = "home/navigation.template.html";
                } else {
                    self.path = "home/api-key.template.html";
                }
                if ($routeParams.userKey) {
                    self.userKey = $routeParams.userKey;
                }

                self.getData = function getData() {
                    if (self.userKey) {
                        // this should save the user in local storage
                        var user = WKW.getUser(self.userKey);
                        // have to wrap the promise in $q because of
                        // Angular's digest cycle
                        $q.when(user.getUserInformation()).then(function() {
                            self.path = "home/navigation.template.html";
                            self.information = user.user_information;
                            if (user.user_information.gravatar) {
                                self.gravatar = user.user_information.getAvatar();
                            }
                            // redirect
                            $location.path('/' + self.userKey + '/navigation');
                        });
                    }
                };
            }
        ]
    });