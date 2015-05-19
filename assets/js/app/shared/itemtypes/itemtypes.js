'use strict';

angular.module('itemtypes', [
  'ngResource'
]);

angular.module('itemtypes')
  .factory('ItemTypesFactory', ['$resource', function ($resource) {
    var resource = $resource('/api/itemtypes');

    delete resource.$query;
    delete resource.$save;
    delete resource.$remove;
    delete resource.$delete;

    return resource;
  }]);