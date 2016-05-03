(function(){
  'use strict';

  angular.module('app.shared').factory('WebNotifyFactory', WebNotifyFactory);

  WebNotifyFactory.$inject = ['$window', 'webNotification'];

  function WebNotifyFactory($window, webNotification) {
      return {
          show: function (title, text) {
              if ($window.localStorage.showDesktopNotifications === 'true') {
                  webNotification.showNotification('Notifier: ' + title, {
                      body: text,
                      icon: '/images/logo.png',
                      autoClose: 3000
                  },
                  function (error, hide) {
                      if (error) {
                         console.log(error);
                      } 
                  });
              }
          }
      };
  }

})();
