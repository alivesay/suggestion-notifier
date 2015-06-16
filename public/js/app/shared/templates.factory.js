(function(){
  'use strict';

  angular.module('app.shared').factory('TemplateFactory', TemplateFactory);

  TemplateFactory.$inject = ['$resource'];

  function TemplateFactory($resource) {
    return $resource(
      '/api/templates/:id',
      { id: '@id' }
    );
  }

})();