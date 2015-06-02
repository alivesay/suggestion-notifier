(function(){
  'use strict';

  angular.module('app.shared')
    .factory('ItemTypesFactory', ItemTypesFactory);

  ItemTypesFactory.$inject = ['$resource'];

  function ItemTypesFactory($resource) {
    var resource = $resource('/api/itemtypes');

    delete resource.$query;
    delete resource.$save;
    delete resource.$remove;
    delete resource.$delete;

    return resource;
  }

})();