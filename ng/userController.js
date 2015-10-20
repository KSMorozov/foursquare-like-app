(function () {
  angular.module('FourApp')
  .controller('UserController', function ($stateParams, $http) {
    var self = this;

    self.getProfile = function () {
      $http.get('/api/users/' + $stateParams.id)
      .then(function (res) {
        self.user = res.data;
        console.log(self.user);
      })
      .catch(function (res) {
        console.log(res.data.message, res.status);
      });
    };

    self.add_friend = function () {
      $http.post('/api/users/' + $stateParams.id + '/friend')
      .then(function (res) {
        console.log(res.data.message);
      })
      .catch(function (res) {
        console.log(res.data ? res.data.message : 'Failed to Friend', res.status);
      });
    };

    self.message = 'Requested id: ' + $stateParams.id;
    self.getProfile();
  });
})();
