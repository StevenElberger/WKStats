module.exports = function(config) {
  config.set({

    basePath: './public',

    files: [
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'testPrep.js',
      'WKW.js',
      'app.js',
      'app.config.js',
      'home/home.module.js',
      'home/home.component.js',
      'levels/levels.module.js',
      'levels/levels.component.js',
      'home/home.component.spec.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine-ajax', 'jasmine'],

    browsers: ['Chrome'],

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine-ajax',
      'karma-jasmine',
      'karma-junit-reporter'
    ],

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};