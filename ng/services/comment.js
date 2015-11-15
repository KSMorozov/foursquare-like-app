(function () {
  angular.module('FourApp')
  .factory('Comment', function ($http) {
    return {
      send_comment : function (comment) {
        return $http.post('/api/comments', comment);
      },
      fetch_comments : function (thing_id) {
        return $http.get('/api/comments/', { params : { id : thing_id } });
      }
    };
  });
})();
