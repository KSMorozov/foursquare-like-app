(function () {
  angular.module('FourApp')
    .controller('Login', function ($scope, $auth, $state, Toast) {

      function close_modal() {
        $timeout(function () {
          $('#login-modal').closeModal();
        }, 0, false);
      }

      // Signup Action
      $scope.signup = function () {
        $auth.signup($scope.user)
        .then(function (res) {
          $auth.setToken(res);
          close_modal();
          $state.go('home');
          Toast.show_toast('success', 'Вы Успешно зарегистрировались');
        })
        .catch(function (res) {
          close_modal();
          $state.go($state.current, {}, {reload: true});
          Toast.show_toast('fail', 'Вы не смогли зарегистрироваться');
        });
      };

      // Signin Action
      $scope.signin = function () {
        $auth.login($scope.user)
        .then(function (res) {
          close_modal();
          $state.go('home');
          Toast.show_toast('success', 'Вы Успешно вошли');
        })
        .catch(function (res) {
          close_modal();
          $state.go($state.current, {}, {reload: true});
          Toast.show_toast('fail', 'Вы не смогли войти');
        });
      };

      $scope.authenticate = function (provider) {
        $auth.authenticate(provider)
        .then(function () {
          close_modal();
          $state.go('home');
          Toast.show_toast('success', 'Вы Успешно вошли');
        })
        .catch(function () {
          close_modal();
          $state.go($state.current, {}, {reload: true});
          Toast.show_toast('fail', 'Вы не смогли войти');
        });
      };

      // Open Login Modal.
      $(document).ready(function () {
        $('#login-modal').openModal({
            dismissible: false,
            opacity: .5, // Opacity of modal background
            in_duration: 300, // Transition in duration
            out_duration: 200, // Transition out duration
            ready: function() { $('ul.tabs').tabs(); }, // Callback for Modal open
            complete: function() {  } // Callback for Modal close
          }
        );
      });

    });
})();
