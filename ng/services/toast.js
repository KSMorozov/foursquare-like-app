(function () {
  angular.module('FourApp')
  .factory('Toast', function ($http, $mdToast) {
    function getToastPosition () {
      sanitizePosition();
      return Object.keys(toastPosition)
        .filter(function (pos) { return toastPosition[pos]; })
        .join(' ');
    }

    function sanitizePosition() {
      var current = toastPosition;
      if ( current.bottom && last.top ) current.top = false;
      if ( current.top && last.bottom ) current.bottom = false;
      if ( current.right && last.left ) current.left = false;
      if ( current.left && last.right ) current.right = false;
      last = angular.extend({},current);
    }

    var last = {
      bottom : false,
      top    : true,
      left   : false,
      right  : true
    };

    var toastPosition = angular.extend({}, last);

    return {
      show_toast : function (type, msg) {
        var toast = $mdToast.simple().theme(type + '-toast')
          .content(msg)
          .position(getToastPosition())
          .hideDelay(3000);
        $mdToast.show(toast);
      }
    };

  });
})();
