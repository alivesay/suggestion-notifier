(function() {
  'use strict';

  angular.module('app.settings')
    .controller('SettingsIndexController', SettingsIndexController);

  SettingsIndexController.$inject = ['$scope', 'APP_CONFIG'];

  function SettingsIndexController($scope, APP_CONFIG) {
    $scope.MODULE_PATH = APP_CONFIG.MODULE_PATH;
  }

})();