(function () {
  angular.module('FourApp')
  .controller('LoginController', function ($mdDialog) {
    var self = this;

    self.message = 'Login Controller';

    self.showDialog = function (ev) {
      $mdDialog.show({
        controller   : 'LoginDialogController',
        controllerAs : 'LoginDialog',
        templateUrl  : 'templates/login.dialog.html',
        parent       : angular.element(document.body),
        targetEvent  : ev,
        clickOutsideToClose : false
      })
      .then(function () {
        self.message += ' hide dialog';
      }, function () {
        self.message += ' close dialog';
      });
    };

    self.showDialog();
  });
})();
