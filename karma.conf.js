// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html


module.exports = function(config) {

  var bower= [
                                  "client/bower_components/angular/angular.js",
                                  "client/bower_components/json3/lib/json3.js",
                                  "client/bower_components/es5-shim/es5-shim.js",
                                  "client/bower_components/jquery/dist/jquery.js",
                                  "client/bower_components/bootstrap/dist/css/bootstrap.css",
                                  "client/bower_components/bootstrap/dist/js/bootstrap.js",
                                  "client/bower_components/angular-resource/angular-resource.js",
                                  "client/bower_components/angular-cookies/angular-cookies.js",
                                  "client/bower_components/angular-sanitize/angular-sanitize.js",
                                  "client/bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
                                  "client/bower_components/font-awesome/css/font-awesome.css",
                                  "client/bower_components/font-awesome/css/font-awesome.min.css",
                                  "client/bower_components/lodash/dist/lodash.compat.js",
                                  "client/bower_components/angular-socket-io/socket.js",
                                  "client/bower_components/angular-ui-router/release/angular-ui-router.js",
                                  "client/bower_components/restangular/dist/restangular.js",
                                  "client/bower_components/ng-Fx/dist/ngFx.js",
                                  "client/bower_components/angular-mocks/angular-mocks.js"
                                ];
  var client= [
                                  "client/app/app.js",
                                  "client/app/account/account.js",
                                  "client/app/admin/admin.controller.js",
                                  "client/app/admin/admin.js",
                                  "client/app/main/main.controller.js",
                                  "client/app/main/main.controller.spec.js",
                                  "client/app/main/main.js",
                                  "client/components/auth/auth.service.js",
                                  "client/components/auth/user.service.js",
                                  "client/components/modal/modal.service.js",
                                  "client/components/mongoose-error/mongoose-error.directive.js",
                                  "client/components/navbar/navbar.controller.js",
                                  "client/components/socket/socket.mock.js",
                                  "client/components/socket/socket.service.js",
                                  "client/app/account/login/login.controller.js",
                                  "client/app/account/settings/settings.controller.js",
                                  "client/app/account/signup/signup.controller.js",
                                  "client/app/admin/admin.html",
                                  "client/app/main/main.html",
                                  "client/components/modal/modal.html",
                                  "client/components/navbar/navbar.html",
                                  "client/app/account/login/login.html",
                                  "client/app/account/settings/settings.html",
                                  "client/app/account/signup/signup.html"
                                ];
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: bower.concat(client),

    preprocessors: {
      '**/*.jade': 'ng-jade2js',
      '**/*.html': 'html2js'
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
    logLevel: config.LOG_ERROR,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
