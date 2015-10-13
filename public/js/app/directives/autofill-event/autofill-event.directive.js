(function(){
    'use strict';
    
    angular.module('ui.autofill-event', [
        'app.config'
    ]);

    angular.module('ui.autofill-event')
        .directive('uiAutofillEvent', uiAutofillEvent);

    uiAutofillEvent.$inject = ['$timeout', 'APP_CONFIG'];
    
    function uiAutofillEvent($timeout, APP_CONFIG) {
        return {
            restrict: 'A',
            link: function uiAutofillEventLink (scope, element, attrs) {
                $timeout(function () {
                    angular.element(element).checkAndTriggerAutoFillEvent();
                }, 200);
            }
        };
    }
})();
