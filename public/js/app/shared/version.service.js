(function(){
    'use strict';

    angular.module('app.shared').service('VersionService', VersionService);

    VersionService.$inject = ['$resource'];

    function VersionService($resource) {
        var self = this;
        self.APP_VERSION = '0.0.0';

        $resource('/api/version').get(function (response) {
            self.APP_VERSION = response.version;
        });

        self.injectAppVersion = function (scope) {
            var stopWatchingForVersion = scope.$watch(function () {
                return self.APP_VERSION;
            }, function (newVersion, oldVersion) {
                if (newVersion !== oldVersion) {
                    scope.APP_VERSION = newVersion;
                    stopWatchingForVersion();
                }
            });
        }
    }

})();
