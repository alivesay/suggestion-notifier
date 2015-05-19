'use strict';

angular.module('app').controller('AlertController', ['$scope', function ($scope) {
  $scope.alerts = [];

  $scope.addAlert = function() {
    $scope.alerts.push({type: 'danger', msg: 'Another alert!'});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
}]);