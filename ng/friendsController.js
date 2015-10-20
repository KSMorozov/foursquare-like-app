(function () {
  angular.module('FourApp')
  .controller('FriendsController', function (Account, $http) {
    var self = this;

    self.friends = [];

    self.get_friends = function () {
      Account.getProfile()
      .then(function (res) {
        res.data.friends.forEach(function (id) {
          $http.get('/api/users/' + id)
          .then(function (res) {
            self.friends.push(res.data);
          });
        });
        console.log('Got Your Friends Boy!', self.friends);
      })
      .catch(function (res) {
        console.log(res.data ? res.data.message : 'Failed to get Friends', res.status);
      });
    };

    self.get_friends();
  });
})();
