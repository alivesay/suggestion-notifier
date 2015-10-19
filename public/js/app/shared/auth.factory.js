(function(){
    'use strict';

    angular.module('app.shared').factory('AuthFactory', AuthFactory);

    function AuthFactory() {
        return {
            get isAuthenticated () {
                return window.sessionStorage.getItem('isAuthenticated') === 'true';
            },
            set isAuthenticated (val) {
                window.sessionStorage.setItem('isAuthenticated', val);
                return val;
            }
        };
    }
})();
