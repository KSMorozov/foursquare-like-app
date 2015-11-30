(function () {
  angular.module('FourApp')
    .controller('Login', function ($scope, $auth, $state, Toast) {

      // Signup Action
      $scope.signup = function () {
        $auth.signup($scope.user)
        .then(function (res) {
          $auth.setToken(res);
          $state.go('home');
          Toast.show_toast('success', 'Вы Успешно зарегистрировались');
        })
        .catch(function (res) {
          $('#login-modal').closeModal();
          $state.go($state.current, {}, {reload: true});
          Toast.show_toast('fail', 'Вы не смогли зарегистрироваться');
        });
      };

      // Signin Action
      $scope.signin = function () {
        $auth.login($scope.user)
        .then(function (res) {
          $state.go('home');
          Toast.show_toast('success', 'Вы Успешно вошли');
        })
        .catch(function (res) {
          $('#login-modal').closeModal();
          $state.go($state.current, {}, {reload: true});
          Toast.show_toast('fail', 'Вы не смогли войти');
        });
      };

      $scope.authenticate = function (provider) {
        $auth.authenticate(provider)
        .then(function () {
          $state.go('home');
          Toast.show_toast('success', 'Вы Успешно вошли');
        })
        .catch(function () {
          $('#login-modal').closeModal();
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
          });
      });

    });
})();
