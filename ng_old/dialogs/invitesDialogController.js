(function () {
  angular.module('FourApp')
  .controller('InvitesDialog', function ($scope, $mdDialog, meeting_id, Account, Toast, Invite) {
    var self = this;

    $scope.send_invites = function () {
      var friends = $scope.friends.filter(function (e) {
        if (e.selected) return e;
      }).map(function (e) {
        return e.friend_id;
      });
      Invite.send_invites({ friends : friends, meeting : meeting_id })
      .then(function (res) {
        Toast.show_toast('success', res.data.message);
      })
      .catch(function (res) {
        Toast.show_toast('failed', res.data.message);
      });
      self.confirm();
    };

    $scope.toggle_all_friends = function (val) {
      $scope.friends = $scope.friends.map(function (e) {
        e.selected = val;
        return e;
      });
    };

    $scope.fetch_friends = function () {
      Account.fetch_friends()
      .then(function (res) {
        $scope.friends = res.data;
      })
      .catch(function (res) {
        Toast.show_toast('failed', res.data.message);
      });
    };

    self.cancel = function () {
      $mdDialog.cancel();
    };

    self.confirm = function () {;
      $mdDialog.hide();
    };

    $scope.fetch_friends();
  });
})();
