angular.module('FourApp')
  .factory('Invite', function ($http) {
    return {
      fetch_invites : function (addresser) {
        return $http.get('/api/invites', { params : { addresser : addresser } });
      }
    }
  });
