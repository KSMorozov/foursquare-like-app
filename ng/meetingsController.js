(function () {
  angular.module('FourApp')
  .controller('MeetingsController', function ($window, $http) {
    var self  = this;
    self.show = false;

    self.meetings = [];
    self.owners   = {};

    self.toggle_map = function () {
      self.show = !self.show;
      return self.show ? init() : self.map.destroy();
    };

    function init () {
      ymaps.ready(function () {
        self.map = new ymaps.Map('map', {
          center: [55.76, 37.64],
          zoom: 11
        });
      });
    }

    angular.element($window).bind('resize', function () {
      if (self.show) self.map.container.fitToViewport();
    });

    self.fetch_meetings = function () {
      $http.get('/api/meetings/')
      .then(function (res) {
        console.log('got meetings', res.data);
        self.meetings = res.data;
        self.fetch_users();
      })
      .catch(function (res) {
        console.log('Failed to fetch meetings.', res.data.status);
      });
    };

    self.fetch_users = function () {
      self.meetings.forEach(function (e) {
        $http.get('/api/users/' + e.owner)
        .then(function (res) {
          self.owners[e.owner] = res.data;
          console.log(self.owners);
        })
        .catch(function () {
          console.log('Failed to fetch owners.');
        });
      });
    };

    self.fetch_meetings();
  });
})();
