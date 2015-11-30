(function () {
  angular.module('FourApp')
  .factory('Invite', function ($http) {
    return {
      send_invites : function (friends) {
        return $http.post('/api/invites', friends);
      },
      fetch_invites : function (addresser_id) {
        return $http.get('/api/invites', { params : { addresser : addresser_id } });
      },
      respond_invite : function (action, invite_id, meeting_id) {
        return $http.post('/api/invites/respond', { action : action, invite_id : invite_id, meeting_id : meeting_id });
      }
    };
  });
})();
