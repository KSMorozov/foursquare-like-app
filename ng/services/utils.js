
(function () {
  angular.module('FourApp')
  .factory('Utils', function ($http) {
    return {
      fetch_tags_for_category : function (category) {
        return $http.get('/utils/categories/' + '?category=' + category);
      }
    };
  });
})();
