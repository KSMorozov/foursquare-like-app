(function () {
  angular.module('FourApp')
    .config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('home', {
          url : '/',
          templateUrl  : 'templates/home.html',
          controller   : 'Home'
        })
        .state('profile', {
          url : '/profile',
          templateUrl  : 'templates/profile.html',
          controller   : 'Profile',
          resolve      : {
            loginRequired: loginRequired
          }
        })
        .state('friends', {
          url : '/friends',
          templateUrl  : 'templates/friends.html',
          controller   : 'Friends',
          resolve      : {
            loginRequired: loginRequired
          }
        })
        .state('user', {
          url : '/user/:id',
          templateUrl : 'templates/user-card.html',
          controller  : 'Single-User',
          resolve     : {
            loginRequired: loginRequired
          }
        })
        .state('chats', {
          url : '/chats',
          templateUrl : 'templates/chats.html',
          controller  : 'Chats',
          resolve     : {
            loginRequired: loginRequired
          }
        })
        .state('chat', {
          url : '/chat/:id',
          templateUrl : 'templates/chat.html',
          controller  : 'Single-Chat',
          resolve     : {
            loginRequired: loginRequired
          }
        })
        .state('login', {
          url : '/login',
          templateUrl  : 'templates/login.html',
          controller   : 'Login',
          resolve      : {
            skipIfLoggedIn: skipIfLoggedIn
          }
        })
        .state('logout', {
          url        : '/logout',
          template   : null,
          controller : 'Logout'
        });


      $urlRouterProvider.otherwise('/');

      $locationProvider.html5Mode(true);

      function skipIfLoggedIn ($q, $auth) {
        var deferred = $q.defer();
        if ($auth.isAuthenticated()) {
          deferred.reject();
        } else {
          deferred.resolve();
        }
        return deferred.promise;
      }

      function loginRequired($q, $auth, $location) {
        var deferred = $q.defer();
        if ($auth.isAuthenticated()) {
          deferred.resolve();
        } else {
          $location.path('/login');
        }
        return deferred.promise;
      }
    });
})();
