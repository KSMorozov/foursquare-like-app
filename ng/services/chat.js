angular.module('FourApp')
  .factory('Chat', function ($http) {
    return {
      fetch_chats : function () {
        return $http.get('/api/messages/chats');
      },
      fetch_chat : function (user, amount, skip) {
        return $http.get('/api/messages/chat', { params : { user : user, amount : amount, skip : skip } });
      },
      send_message : function (user, body) {
        return $http.post('/api/messages', { user : user, body : body });
      }
    }
  });
