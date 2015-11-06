(function () {
  angular.module('FourApp')
  .controller('ChatController', function ($stateParams, $http, Account) {
    var self = this;

    self.comb     = [];
    self.messages = [];
    self.me       = {};
    self.friend   = {};

    self.is_friend    = function (id) {
      return id === $stateParams.id;
    };

    self.get_yourself = function () {
      Account.getProfile()
      .then(function (res) {
        self.me = res.data;
        console.log(self.me);
      });
    };

    self.get_friend   = function () {
      $http.get('/api/users/' + $stateParams.id)
      .then(function (res) {
        self.friend = res.data;
        console.log(self.friend);
      });
    };

    self.get_messages = function () {
      $http.post('/api/messages/chats', {
        friend : $stateParams.id
      })
      .then(function (res) {
        self.messages = res.data;
        console.log(self.messages);
      });
    };

    self.send_message = function () {
      $http.post('/api/messages', {
        user_id : $stateParams.id, body : self.message
      })
      .then(function (res) {
        self.message = '';
        console.log(res.data);
      })
      .catch(function (res) {
        console.log(res.status);
      });
    };

    self.up   = function (e) { self.comb.push(e.keyCode) };

    self.down = function (e) { self.comb = []; self.comb.push(e.keyCode) };

    self.check = function () {
      if (self.comb.join('').split(0, 4) == '1391') self.send_message();
    };

    self.get_messages();
    self.get_yourself();
    self.get_friend();
  });
})();
