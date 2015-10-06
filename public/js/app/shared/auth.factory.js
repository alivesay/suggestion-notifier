(function(){
    'use strict';

    angular.module('app.shared').factory('AuthFactory', AuthFactory);

    function AuthFactory() {
        return {
            get isLogged () {
                return window.sessionStorage.getItem('isLogged') === 'true';
            },
            set isLogged (val) {
                window.sessionStorage.setItem('isLogged', val);
                return val;
            }
        };
    }
})();
