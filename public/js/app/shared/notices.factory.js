(function(){
  'use strict';

  angular.module('app.shared').factory('NoticeFactory', NoticeFactory);

  NoticeFactory.$inject = ['$resource'];

  function NoticeFactory($resource) {
    return $resource('/api/notices/:id');
  }

})();