(function () {
  angular.module('FourApp')
  .controller('LoginDialogController', function ($mdDialog, $auth, $state) {
    var self = this;

    self.status = 'Войти';

    self.hide   = function () {
      $mdDialog.hide();
    };

    self.change_status = function (status) {
      self.status = status;
    };

    self.providers = [
      { name : 'facebook' , display : 'Facebook' ,  icon : 'facebook.svg'},
      { name : 'google'   , display : 'Google'   ,  icon : 'google.svg'},
      { name : 'instagram', display : 'Instagram',  icon : 'instagram.svg'},
      { name : 'twitter'  , display : 'Twitter'  ,  icon : 'twitter.svg'},
      { name : 'vkontakte', display : 'Vkontakte',  icon : 'vkontakte.svg'}
    ];

    self.signup = function () {
      $auth.signup(self.user)
      .then(function (res) {
        $auth.setToken(res);
        $state.go('home');
        self.hide();
        console.log('Authenticated boys');
      })
      .catch(function (res) {
        console.log('Failed to Authenticate boys');
      });
    };

    self.login = function () {
      $auth.login(self.user)
      .then(function () {
        console.log('Logged in boys');
        $state.go('home');
        self.hide();
      })
      .catch(function (res) {
        console.log('Failed to Login boys');
      });
    };

    self.authenticate = function (provider) {
      $auth.authenticate(provider)
      .then(function () {
        console.log('Authenticated boys');
        $state.go('home');
        self.hide();
      })
      .catch(function (res) {
        console.log('Failed to Authenticate boys');
      });
    };
  });
})();
