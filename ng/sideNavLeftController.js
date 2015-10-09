(function () {
  angular.module('FourApp')
  .controller('SideNavLeftController', function ($timeout, $mdSidenav, $log) {
    var self   = this;

    self.close = function () {
      $mdSidenav('left').close()
        .then(function () {
          $log.debug('close Left is done.');
        });
    };
  });
})();
