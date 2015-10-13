(function(){
    'use strict';
    
    angular.module('ui.on-long-press', [
        'app.config'
    ]);

    angular.module('ui.on-long-press')
        .directive('uiOnLongPress', uiOnLongPress);

    uiOnLongPress.$inject = ['$timeout', 'APP_CONFIG'];
    
    function uiOnLongPress($timeout, APP_CONFIG) {
        return {
            restrict: 'A',
            link: function uiOnLongPressLink (scope, element, attrs) {
                var timeoutPromise = undefined;
                var handlerCalled = false;

                element.bind('mousedown touchstart', startHandler);
                element.bind('mouseup click touchend', doneHandler);
                
                function startHandler(event) {
                    handlerCalled = false;
                    event.stopImmediatePropagation();
                    event.preventDefault();
                    timeoutPromise = $timeout(function() {
                        if (attrs.uiOnLongPress) {
                            handlerCalled = true;
                            scope.$apply(function () {
                                scope.$eval(attrs.uiOnLongPress);
                            });
                        }
                    }, 600);
                }
                
                function doneHandler(event) {
                    if (handlerCalled) {
                        event.stopImmediatePropagation();
                        event.preventDefault();
                    }
                    $timeout.cancel(timeoutPromise);
                }
            }
        };
    }
})();
