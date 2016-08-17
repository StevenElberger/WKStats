'use strict';

var filters = angular.module('filters', []);

filters.filter('days', function() {
    return function(input) {
        // expect input in seconds
        input = input || 0;
        var minutes, days, hours, result;
        if (input === 0) {
            result = "0 Days, 0 minutes";
        } else {
            input = Math.floor(input / 60);
            minutes = input % 60;
            input = Math.floor(input / 60);
            hours = input % 24;
            input = Math.floor(input / 24);
            days = input;
            result = days + " Days, " + minutes + " minutes";
        }
        return result;
    };
});