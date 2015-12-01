(function () {
  angular.module('FourApp')
    .controller('Single-Chat', function ($scope, $stateParams, Chat, Toast) {
      var message = '';
      $scope.show = false;

      var user   = $stateParams.id;
      var amount = 20;
      var skip   = 0;

      $scope.fetch_chat = function (user, amount, skip) {
        Chat.fetch_chat(user, amount, skip)
        .then(function (res) {
          $scope.chat = res.data;
          $scope.show = true;
        })
        .catch(function (res) {
          Toast.show_toast('fail', res.data.message || 'Не удалось получить сообщения.');
          $scope.show = true;
        });
      };

      $scope.send_message = function () {
        Chat.send_message($stateParams.id, $scope.message)
        .then(function (res) {
          $scope.chat.push(res.data);
          Toast.show_toast('success', res.data.message || 'Успешно отправили сообщение.');
          $scope.message = '';
        })
        .catch(function (res) {
          Toast.show_toast('fail', res.data.message || 'Не удалось отправить сообщение.');
        });
      };

      $scope.fetch_chat(user, amount, skip);
    });
})();
