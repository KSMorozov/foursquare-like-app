(function () {
  angular.module('FourApp')
    .controller('Friends', function ($scope, $auth, Toast, Account) {
      $scope.get_friends = function () {
        Account.get_friends()
        .then(function (res) {
          $scope.friends = res.data;
        })
        .catch(function (res) {
          Toast.show_toast('fail', 'Мы не смогли найти ваших друзей.');
        });
      };

      $scope.get_friends();
    });
})();
