(function () {
  angular.module('FourApp')
  .factory('Toast', function () {

    return {
      show_toast : function (type, msg) {
        Materialize.toast('<span>' + msg + '</span>', 3000);
        $(document).ready(function () { $('#toast-container .toast').addClass(type); });
      }
    };

  });
})();
