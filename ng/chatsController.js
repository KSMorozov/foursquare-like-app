(function () {
  angular.module('FourApp')
  .controller('ChatsController', function ($http, Account) {
    var self = this;

    self.chats = [];

    self.get_chats = function () {
      Account.getProfile()
      .then(function (res) {
        res.data.friends.forEach(function (id) {
          $http.post('/api/messages/chats', {
            friend : id,
            amount : 1
          })
          .then(function (res) {
            console.log(res.data);
            $http.get('/api/users/' + id)
            .then(function (response) {
              self.chats.push({
                friend_id   : id,
                displayName : response.data.displayName,
                picture     : response.data.picture,
                message     : res.data[0].body
              });
            });
          });
        });
      });
    };

    self.get_chats();
  });
})();
