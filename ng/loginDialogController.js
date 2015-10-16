(function () {
  angular.module('FourApp')
  .controller('LoginDialogController', function ($mdDialog, $auth, $state) {
    var self = this;

    self.hide   = function () {
      $mdDialog.hide();
    };

    self.cancel = function () {
      $mdDialog.cancel();
    };

    var providers = [
      { name : 'facebook' , display : 'Facebook' ,  icon : 'facebook.svg'},
      { name : 'google'   , display : 'Google'   ,  icon : 'google.svg'},
      { name : 'instagram', display : 'Instagram',  icon : 'instagram.svg'},
      { name : 'twitter'  , display : 'Twitter'  ,  icon : 'twitter.svg'},
      { name : 'vkontakte', display : 'Vkontakte',  icon : 'vkontakte.svg'}
    ];

    self.login = function () {
      $auth.login(self.user)
      .then(function () {
        console.log('Logged in boys');
        $state.go('home');
        self.hide();
      })
      .catch(function (res) {

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

      });
    }
  });
})();
