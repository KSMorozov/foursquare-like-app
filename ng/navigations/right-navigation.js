(function () {
  angular.module('FourApp')
    .controller('RightNavigation', function ($scope, $rootScope, $timeout) {

      $rootScope.$on('apply_categories_tags', function (event, data) {
        $scope.categories = data.categories;
      });

      $scope.open_tags_picker = function () {
        // Open Login Modal.
        $timeout(function () {
          $(document).ready(function () {
            $('#tags-modal').openModal({
                dismissible: true,
                opacity: .5, // Opacity of modal background
                in_duration: 300, // Transition in duration
                out_duration: 200, // Transition out duration
                ready: function() {  }, // Callback for Modal open
                complete: function() {  } // Callback for Modal close
              }
            );
          });
        }, 0, false);
      };

    });
})();
