(function () {
  angular.module('FourApp')
  .controller('NavbarController', function ($timeout, $mdSidenav, $mdUtil, $log, $auth) {
    var self         = this;
    self.toggleLeft  = toggler('left');

    self.isAuthenticated = function () {
      return $auth.isAuthenticated();
    };

    function toggler (navID) {
      var debounceFn = $mdUtil.debounce(function () {
            $mdSidenav(navID)
              .toggle()
              .then(function () {
                $log.debug('toggle ' + navID + 'is done');
            });
          }, 200);
      return debounceFn;
    }
  });
})();
