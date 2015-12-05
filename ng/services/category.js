angular.module('FourApp')
  .factory('Category', function ($http) {
    return {
      fetch_categories : function () {
        return $http.get('/utils/categories');
      }
    }
  });
