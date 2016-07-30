'use strict'

angular.
    module('home').
    component('home', {
        templateUrl: 'home/home.template.html',
        controller: ['$q', '$rootScope', '$location',
            function HomeController($q, $rootScope, $location) {
                var self = this;

                // defaults
                self.path = "/home/api-key.template.html";
                self.userKey = "";

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