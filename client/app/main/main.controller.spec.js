'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('baseApp'));
  beforeEach(module('socketMock'));

  var MainCtrl,
      scope,
      serverUrl,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope, serverUrl) {
    serverUrl = serverUrl;
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET(serverUrl+'things')
      .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);

    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of things to the scope', function () {
    $httpBackend.flush();
    expect(scope.awesomeThings.length).toBe(4);
  });
});
