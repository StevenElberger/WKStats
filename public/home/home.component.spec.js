describe('home', function() {

    // Load the module that contains the `home` component before each test
    beforeEach(function() {
        module('home');
    });

    // Test the controller
    describe('HomeController', function() {
        var ctrl;

        // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
        // This allows us to inject a service and assign it to a variable with the same name
        // as the service while avoiding a name conflict.
        beforeEach(inject(function($componentController) {
            ctrl = $componentController("home");
        }));

        it("should redirect and add key properties to the controller", function() {
            expect(ctrl.path).toBe("home/api-key.template.html");
            ctrl.userKey = "bbf426d6937cbb77d9f908c08d90c3ce"; // simulate entering text
            spyOn($, 'getJSON').and.callFake(function (url, success) {
                success({
                    "user_information": {
                        "username": "TestUser",
                        "gravatar": "bbf426d6937cbb77d9f908c08d90c3ce",
                        "level": 30,
                        "title": "Turtles",
                        "about": "",
                        "website": null,
                        "twitter": null,
                        "topics_count": 0,
                        "posts_count": 0,
                        "creation_date": 1388623423,
                        "vacation_date": null
                    }
                });
            });
            ctrl.getData();
            setTimeout(() => {
                expect(ctrl.path).toBe("home/navigation.template.html");
                expect(ctrl.userKey).toBe("bbf426d6937cbb77d9f908c08d90c3ce");
                expect(ctrl.gravatar).toBe("https://www.gravatar.com/avatar/bbf426d6937cbb77d9f908c08d90c3ce");
            });
        });
    });
});