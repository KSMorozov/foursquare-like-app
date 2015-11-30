(function () {
  angular.module('FourApp')
    .factory('Comment', function ($http) {
      return {
        leave_comment : function (thing, body) {
          return $http.post('/api/comments', { thing : thing, body : body });
        },
        fetch_comments : function (thing) {
          return $http.get('/api/comments', { params : { thing : thing } });
        }
      };
    });
})();
