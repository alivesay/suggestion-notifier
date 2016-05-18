(function() {
  'use strict';

  angular.module('app.settings')
    .controller('SettingsIndexController', SettingsIndexController);

  SettingsIndexController.$inject = ['$scope', 'APP_CONFIG', '$http'];

  function SettingsIndexController($scope, APP_CONFIG, $http) {
    $scope.MODULE_PATH = APP_CONFIG.MODULE_PATH;
    $scope.saveAppSettings = saveAppSettings;

    onLoad();

    function onLoad() {
        loadConfig();
    }

    function loadConfig() {
        $http.get('/api/config/app.settings')
            .then(function success(response) {
                $scope.appSettings = JSON.parse(response.data.value);
                console.log($scope.appSettings);
            }, function error(response) {
                console.log('Error: failed to fetch app.settings');
            });
    }

    function saveAppSettings() {
        $http.post('/api/config/app.settings', $scope.appSettings)
            .then(function success(response) {
            }, function error(response) {
                console.log('Error: failed to save app.settings');
            });
    }
  }

})();
