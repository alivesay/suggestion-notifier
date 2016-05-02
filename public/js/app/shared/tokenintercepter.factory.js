(function () {
  'use strict';

  angular.module('app.shared')
    .factory('TokenInterceptorFactory', TokenInterceptorFactory);

  TokenInterceptorFactory.$inject = ['$q', '$window', '$location', 'AuthFactory'];

  function TokenInterceptorFactory($q, $window, $location, AuthFactory) {
    return {
      request: function request (config) {
        config.headers = config.headers || {};
        if ($window.sessionStorage.token) {
          config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
        }
        return config;
      },

      requestError: function requestError (rejection) {
        return $q.reject(rejection);
      },

      response: function (response) {
        if (response != null && response.status == 200 && $window.sessionStorage.token && !AuthFactory.isAuthenticated) {
          AuthFactory.isAuthenticated = true;
        }
        return response || $q.when(response);
      },

      responseError: function(rejection) {
        if (rejection != null && rejection.status === 401 && ($window.sessionStorage.token || AuthFactory.isAuthenticated)) {
          delete $window.sessionStorage.token;
          AuthFactory.isAuthenticated = false;
          $location.path("/login");
        }

        return $q.reject(rejection);
      }
    };
  }

})();
