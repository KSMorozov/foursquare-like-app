(function () {
  angular.module('FourApp')
  .controller('ApplicationController', function () {
    var self = this;
    self.a = function () {
      console.log('hey');
    }
  });
})();
