(function () {
  angular.module('FourApp')
  .controller('SideNavRightController', function ($mdDialog) {
    var self = this;

    self.show_categories = function (ev) {
      $mdDialog.show({
        controller   : 'CategoriesDialog',
        controllerAs : 'Categories',
        templateUrl  : 'templates/categories.dialog.html',
        parent       : angular.element(document.body),
        targetEvent  : ev,
        clickOutsideToClose : true
      })
      .then(function () {
        self.message += ' hide dialog';
      }, function () {
        self.message += ' close dialog';
      });
    };
  });
})();
