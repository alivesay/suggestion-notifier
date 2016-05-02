(function(){
    'use strict';

    angular.module('app.shared').factory('AuthFactory', AuthFactory);

    AuthFactory.$inject = ['$injector'];

    function AuthFactory($injector) {

        return {
            get isAuthenticated () {
                return window.sessionStorage.getItem('isAuthenticated') === 'true';
            },
            set isAuthenticated (val) {
                window.sessionStorage.setItem('isAuthenticated', val);
                return val;
            },

            login: function login (username, password) {
              var $resource = $injector.get('$resource');

              var resource = $resource('/api/login');

              return resource.save({
                username: username,
                password: password
              }).$promise;
            },

            logout: function logout () {
              var $resource = $injector.get('$resource');

              var resource = $resource('/api/logout');
              
              return resource.get().$promise;
            }
        };
    }
})();
