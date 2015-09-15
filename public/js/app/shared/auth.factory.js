(function(){
  'use strict';

  angular.module('app.shared').factory('AuthFactory', AuthFactory);

  function AuthFactory() {
    var auth = {
      isLogged: false
    };

    return auth;
  }

})();