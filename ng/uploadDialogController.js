(function () {
  angular.module('FourApp')
  .controller('UploadDialog', function ($mdDialog, Account, $state, $http, $scope) {
    var self = this;

    self.upload = function () {
      var fd = new FormData();
      fd.append('file', $scope.myFile);
      $http.post('/api/uploads/avatars', fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
      .then(function (res) {
        self.image = res.data.picture;
        console.log(res, 'WE did it Fam!');
      })
      .catch(function (res) {
        console.log('rekt', res.status);
      });
    };

    self.close = function () {
      $mdDialog.hide();
      $state.go('profile');
    };
    
  });
})();
