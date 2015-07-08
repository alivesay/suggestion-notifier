(function(){
  'use strict';

  function timestampStringsToDates(response) {
    angular.forEach(response.data, function (value, key) {
      response.data[key].createdAt = new Date(value.createdAt);
      response.data[key].updatedAt = new Date(value.updatedAt);
    });

    return response.data;
  }

  angular.module('app.shared').factory('SuggestionFactory', SuggestionFactory);

  SuggestionFactory.$inject = ['$resource'];

  function SuggestionFactory($resource) {
    return $resource('/api/suggestions/:id', {
        id: '@id'
      },
      {
        'query': {
          method: 'GET',
          isArray: true,
          interceptor: { response: timestampStringsToDates }
        }
      }
    );
  }

})();