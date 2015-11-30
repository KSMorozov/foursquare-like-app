(function () {
  angular.module('FourApp')
    .controller('Chats', function ($scope, Chat) {
      $scope.fetch_chats = function () {
        Chat.fetch_chats()
        .then(function (res) {
          $scope.chats = res.data;
          console.log(res.data);
        })
        .catch(function (res) {
          Toast.show_toast('fail', res.data.message || 'Не получилось найти сообщения.');
        });
      };

      $scope.fetch_chats();
    });
})();
