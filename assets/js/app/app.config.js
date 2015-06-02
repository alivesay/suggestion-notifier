(function() {
  'use strict';

  angular.module('app.config', []);

  var APP_PATH = '/js/app/';

  angular.module('app.config')
    .constant('APP_CONFIG', {
      APP_PATH: APP_PATH,
      COMPONENT_PATH: APP_PATH + 'components/'
    });

})();