"use strict";

var progressBar = angular.module('progressBar', []);

progressBar.directive('progressBar', function() {
    return {
        restrict: 'E',
        scope: {
            loading: '=',
            loadingProgress: '@'
        },
        templateUrl: 'progress-bar/progress-bar.template.html'
    };
});