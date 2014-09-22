// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
            "client/bower_components/angular/angular.js",
            "client/bower_components/json3/lib/json3.js",
            "client/bower_components/es5-shim/es5-shim.js",
            "client/bower_components/jquery/dist/jquery.js",
            "client/bower_components/bootstrap/dist/css/bootstrap.css",
            "client/bower_components/bootstrap/dist/js/bootstrap.js",
            "client/bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.eot",
            "client/bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.svg",
            "client/bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf",
            "client/bower_components/bootstrap/dist/fonts/glyphicons-halflings-regular.woff",
            "client/bower_components/angular-resource/angular-resource.js",
            "client/bower_components/angular-cookies/angular-cookies.js",
            "client/bower_components/angular-sanitize/angular-sanitize.js",
            "client/bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
            "client/bower_components/font-awesome/css/font-awesome.css",
            "client/bower_components/font-awesome/fonts/FontAwesome.otf",
            "client/bower_components/font-awesome/fonts/fontawesome-webfont.eot",
            "client/bower_components/font-awesome/fonts/fontawesome-webfont.svg",
            "client/bower_components/font-awesome/fonts/fontawesome-webfont.ttf",
            "client/bower_components/font-awesome/fonts/fontawesome-webfont.woff",
            "client/bower_components/lodash/dist/lodash.compat.js",
            "client/bower_components/angular-socket-io/socket.js",
            "client/bower_components/angular-ui-router/release/angular-ui-router.js",
            "client/bower_components/restangular/dist/restangular.js",
            "client/bower_components/ng-Fx/dist/ngFx.js"
          ],

    preprocessors: {
      '**/*.jade': 'ng-jade2js',
      '**/*.html': 'html2js',
      '**/*.coffee': 'coffee',
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'client/'
    },

    ngJade2JsPreprocessor: {
      stripPrefix: 'client/'
    },

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
