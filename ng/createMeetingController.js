(function () {
  angular.module('FourApp')
  .controller('NewMeetingController', function ($http, $window, $scope) {
    var self  = this;
    $scope.map = {
      center : [55.76, 37.64],
      zoom   : 11,
      show   : false,
      spot   : null
    };

    self.categories = {
      movies : {
        name : 'Кино',
        show : false,
        tags : [],
        pic  : 'http://i.imgur.com/qR9A2Fi.png'
      },
      food : {
        name : 'Еда',
        show : false,
        tags : [],
        pic  : 'http://i.imgur.com/qR9A2Fi.png'
      },
      sports : {
        name : 'Спорт',
        show : false,
        tags : [],
        pic  : 'http://i.imgur.com/qR9A2Fi.png'
      },
      arts : {
        name : 'Творчество',
        show : false,
        tags : [],
        pic  : 'http://i.imgur.com/qR9A2Fi.png'
      },
      eco : {
        name : 'Природа',
        show : false,
        tags : [],
        pic  : 'http://i.imgur.com/qR9A2Fi.png'
      },
      dance : {
        name : 'Танцы',
        show : false,
        tags : [],
        pic  : 'http://i.imgur.com/qR9A2Fi.png'
      },
      music : {
        name : 'Музыка',
        show : false,
        tags : [],
        pic  : 'http://i.imgur.com/qR9A2Fi.png'
      },
      cars : {
        name : 'Транспорт',
        show : false,
        tags : [],
        pic  : 'http://i.imgur.com/qR9A2Fi.png'
      },
      theatre : {
        name : 'Театр',
        show : false,
        tags : [],
        pic  : 'http://i.imgur.com/qR9A2Fi.png'
      },
      it : {
        name : 'Мультимедия и ИТ',
        show : false,
        tags : [],
        pic  : 'http://i.imgur.com/qR9A2Fi.png'
      },
      science : {
        name : 'Наука',
        show : false,
        tags : [],
        pic  : 'http://i.imgur.com/qR9A2Fi.png'
      },
      mystic : {
        name : 'Мистика',
        show : false,
        tags : [],
        pic  : 'http://i.imgur.com/qR9A2Fi.png'
      },
      charity : {
        name : 'Благотворительность',
        show : false,
        tags : [],
        pic  : 'http://i.imgur.com/qR9A2Fi.png'
      }
    };

    self.meeting = {
      time  : new Date().getHours() + ':' + new Date().getMinutes(),
      place : '',
      categories  : {}
    };

    self.choose_place = function (place) {
      self.option = place;
      if (self.option === 'nearby') {
        $scope.map.show = true;
        ymaps.geolocation.get({ provider : 'browser', mapStateAutoApply : true })
        .then(function (res) {
          var coordinates = res.geoObjects.get(0).geometry.getCoordinates();
          self.meeting.place = $scope.map.spot = coordinates;
          console.log(self.meeting);
        });
      } else if (self.option === 'direction') {
        $scope.map.show = true;
        $scope.$watch(function () { return self.direction },
          function (n, o) {
            if (n === o) return ;
            ymaps.geocode(self.direction, { results : 1 })
            .then(function (res) {
              var coordinates = res.geoObjects.get(0).geometry.getCoordinates();
              self.meeting.place = $scope.map.spot = coordinates;
            });
          }
        );
      } else if (self.option === 'onmap') {
        $scope.map.show = true;
      } else {
        $scope.map.show = false;
        $scope.map.spot = null;
      }
    };

    self.fetch_tags = function (category) {
      self.categories[category].show = !self.categories[category].show;
      if (!self.categories[category].show) return;
      (function () { for (var p in self.categories) { if (self.categories.hasOwnProperty(p) && p != category) self.categories[p].show = false; } })();
      $http.get('/api/meetings/tags/' + category)
      .then(function (res) {
        self.categories[category].tags = res.data[category];
        console.log(self.categories[category].tags);
      })
      .catch(function (res) {
        console.log(res.status);
      });
    };

    self.toggle = function (tag, category) {
      var exists = self.meeting.categories[category];
      console.log(tag + ' ' + category);
      if (exists) {
        var idx = self.meeting.categories[category].indexOf(tag);
        if (idx > -1) self.meeting.categories[category].splice(idx, 1)
        else self.meeting.categories[category].push(tag)
      }
      else self.meeting.categories[category] = [tag];
      console.log(self.meeting.categories[category]);
    };

    self.checked = function (tag, category) {
      return self.meeting.categories[category].indexOf(tag) > -1;
    }

    // $scope.$watch(function () { return self.option; }, function (n, o) {
    //   if (n === o) return ;
    //   else init();
    // });
    //
    // function init () {
    //   ymaps.ready(function () {
    //     if (self.map) {
    //       self.map.destroy();
    //       self.map = null;
    //     }
    //     if (self.option === 'any') {
    //       self.show = false;
    //       console.log('any', self.show, self.map);
    //     } else {
    //       self.map = new ymaps.Map('map', {
    //         center: [55.76, 37.64],
    //         zoom: 11
    //       });
    //       if (self.option === 'nearby') {
    //         self.show = true;
    //         console.log('nearby', self.show, self.map);
    //         var geolocation = ymaps.geolocation;
    //         geolocation.get({ provider : 'browser', mapStateAutoApply : true })
    //           .then(function (res) {
    //             var first  = res.geoObjects.get(0);
    //             var coords = first.geometry.getCoordinates();
    //             var bounds = first.properties.get('boundedBy');
    //             self.meeting.place = coords;
    //             self.map.geoObjects.add(first);
    //             self.map.setBounds(bounds, { checkZoomRange : true });
    //           });
    //       } else if (self.option === 'direction') {
    //         self.show = true;
    //         console.log('direction', self.show, self.map);
    //         $scope.$watch(function () {
    //           return self.direction;
    //         }, function (n, o) {
    //           if (n == o) return ;
    //           ymaps.geocode(self.direction, {
    //             results : 1
    //           })
    //             .then(function (res) {
    //               self.map.geoObjects.removeAll();
    //               var first  = res.geoObjects.get(0);
    //               var coords = first.geometry.getCoordinates();
    //               var bounds = first.properties.get('boundedBy');
    //               self.meeting.place = coords;
    //               self.map.geoObjects.add(first);
    //               self.map.setBounds(bounds, { checkZoomRange : true });
    //             });
    //         });
    //       } else if (self.option === 'onmap'){
    //         self.show = true;
    //         console.log('onmap', self.show, self.map);
    //         self.map.events.add('click', function (e) {
    //           console.log(e.get('coords'));
    //         });
    //       }
    //     }
    //     console.log('the end.', self.show, self.map);
    //   });
    // }
  });
})();
