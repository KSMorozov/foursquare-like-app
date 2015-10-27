(function () {
  angular.module('FourApp')
  .controller('MeetingsController', function ($window) {
    var self  = this;
    self.show = false;

    self.meetings = [
      { date : '22/10/2015', title : 'Me & u', loc : 'Moscow', likes : 10, attendees : 5, picture: 'images/avatars/meeting.jpg' },
      { date : '22/10/2015', title : 'Me & u', loc : 'Moscow', likes : 10, attendees : 5, picture: 'images/avatars/meeting.jpg' },
      { date : '22/10/2015', title : 'Me & u', loc : 'Moscow', likes : 10, attendees : 5, picture: 'images/avatars/meeting.jpg' },
      { date : '22/10/2015', title : 'Me & u', loc : 'Moscow', likes : 10, attendees : 5, picture: 'images/avatars/meeting.jpg' },
    ];

    self.toggle_map = function () {
      self.show = !self.show;
      return self.show ? init() : self.map.destroy();
    };

    function init () {
      ymaps.ready(function () {
        self.map = new ymaps.Map('map', {
          center: [55.76, 37.64],
          zoom: 7
        });
      });
    }

    angular.element($window).bind('resize', function () {
      if (self.show) self.map.container.fitToViewport();
    });
  });
})();
