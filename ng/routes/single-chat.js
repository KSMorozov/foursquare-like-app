(function () {
  angular.module('FourApp')
    .controller('Single-Chat', function ($scope, $stateParams, Chat, Toast) {
      var message = '';

      var user   = $stateParams.id;
      var amount = 20;
      var skip   = 0;

      $scope.fetch_chat = function (user, amount, skip) {
        Chat.fetch_chat(user, amount, skip)
        .then(function (res) {
          $scope.chat = res.data;
          console.log(res.data);
        })
        .catch(function (res) {
          Toast.show_toast('fail', res.data.message || 'Не удалось получить сообщения.');
          console.log(res.data);
        });
      };

      $scope.send_message = function () {
        console.log($scope.message);
        Chat.send_message($stateParams.id, $scope.message)
        .then(function (res) {
          $scope.chat.push(res.data);
          console.log(res.data);
          $scope.message = '';
        })
        .catch(function (res) {
          Toast.show_toast('fail', res.data.message || 'Не удалось отправить сообщение.');
        });
      };

      $scope.fetch_chat(user, amount, skip);
    });
})();
