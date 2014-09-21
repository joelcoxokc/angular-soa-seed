'use strict';

angular.module('baseApp')
  .controller('MainCtrl', function (serverUrl, $scope, $http, socket) {
    $scope.awesomeThings = [];

    $http.get(serverUrl+'things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post(serverUrl+'things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete(serverUrl+'things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });
