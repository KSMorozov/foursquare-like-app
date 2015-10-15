(function () {
  angular.module('FourApp')
  .controller('ProfileController', function (Account, $filter) {
    var self = this;

    self.getProfile = function () {
      Account.getProfile()
      .then(function (res) {
        self.user = res.data;
        self.user.date = new Date(self.user.date) || new Date();
        console.log(self.user);
      })
      .catch(function (res) {
        console.log(res.data.message, res.status);
      });
    };

    self.updateProfile = function () {
      Account.updateProfile(self.user)
      .then(function () {
        console.log('Profile Updated!');
      })
      .catch(function (res) {
        console.log(res.data.message, res.status);
      });
    }

    self.getProfile();
  });
})();
