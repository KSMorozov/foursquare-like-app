(function () {
  angular.module('FourApp')
    .controller('Logout', function ($scope, $auth, $state, Toast) {
      if (!$auth.isAuthenticated) return;
      $auth.logout()
      .then(function () {
        Toast.show_toast('success', 'Вы успешно вышли');
        $state.go('login');
      });
    });
})();
