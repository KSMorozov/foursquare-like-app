(function () {
  angular.module('FourApp')
  .controller('NewMeetingController', function ($http, $window, $scope, Account) {
    var self  = this;
    $scope.map = {
      center : [55.76, 37.64],
      zoom   : 11,
      show   : false,
      spot   : null,
      options: { draggable : false }
    };

    self.categories = {
      movies : {
        name : 'Кино',
        show : false,
        tags : [],
        pic  : 'images/category_icons/movies.png'
      },
      food : {
        name : 'Еда',
        show : false,
        tags : [],
        pic  : 'images/category_icons/food.png'
      },
      sports : {
        name : 'Спорт',
        show : false,
        tags : [],
        pic  : 'images/category_icons/sports.png'
      },
      arts : {
        name : 'Творчество',
        show : false,
        tags : [],
        pic  : 'images/category_icons/arts.png'
      },
      eco : {
        name : 'Природа',
        show : false,
        tags : [],
        pic  : 'images/category_icons/eco.png'
      },
      dance : {
        name : 'Танцы',
        show : false,
        tags : [],
        pic  : 'images/category_icons/dance.png'
      },
      music : {
        name : 'Музыка',
        show : false,
        tags : [],
        pic  : 'images/category_icons/music.png'
      },
      cars : {
        name : 'Транспорт',
        show : false,
        tags : [],
        pic  : 'images/category_icons/cars.png'
      },
      theatre : {
        name : 'Театр',
        show : false,
        tags : [],
        pic  : 'images/category_icons/theatre.png'
      },
      it : {
        name : 'Мультимедия и ИТ',
        show : false,
        tags : [],
        pic  : 'images/category_icons/it.png'
      },
      science : {
        name : 'Наука',
        show : false,
        tags : [],
        pic  : 'images/category_icons/science.png'
      },
      mystic : {
        name : 'Мистика',
        show : false,
        tags : [],
        pic  : 'images/category_icons/mystic.png'
      },
      charity : {
        name : 'Благотворительность',
        show : false,
        tags : [],
        pic  : 'images/category_icons/charity.png'
      }
    };

    self.meeting = {
      time  : time(),
      place : '',
      categories  : {}
    };

    self.create_meeting = function () {
      // console.log(self.meeting);
      Account.getProfile()
      .then(function (res) {
        var id = res.data._id;
        $http.post('/api/meetings/', {
          owner       : id,
          description : self.meeting.description,
          eventname   : self.meeting.event,
          location    : self.meeting.place,
          date        : self.meeting.date,
          time        : self.meeting.time,
          private     : self.meeting.private,
          categories  : self.meeting.categories
        })
        .then(function (res) {
          console.log(res.data);
        })
        .catch(function (res) {
          console.log(res);
        });
      })
      .catch(function (res) {
        console.log(res);
      });
    };

    self.choose_place = function (place) {
      self.option = place;
      if (self.option === 'nearby') {
        $scope.map.show = true;
        ymaps.geolocation.get({ provider : 'browser', mapStateAutoApply : true })
        .then(function (res) {
          var coordinates = res.geoObjects.get(0).geometry.getCoordinates();
          self.meeting.place = $scope.map.spot = coordinates;
        });
        $scope.map.options.draggable = false;
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
        $scope.map.options.draggable = false;
      } else if (self.option === 'onmap') {
        $scope.map.spot = null;
        $scope.map.show = true;
        ymaps.geolocation.get({ provider : 'browser', mapStateAutoApply : true })
        .then(function (res) {
          var coordinates = res.geoObjects.get(0).geometry.getCoordinates();
          self.meeting.place = $scope.map.spot = coordinates;
        });
        $scope.$watch(function () { return $scope.map.center; },
          function (n, o) {
            if (n[0] === o[0] && n[1] === o[1]) return ;
            self.meeting.place = n;
          }
        );
        $scope.map.options.draggable = true;
      } else {
        $scope.map.show = false;
        $scope.map.spot = null;
        $scope.map.options.draggable = false;
      }
    };

    self.fetch_tags = function (category) {
      self.categories[category].show = !self.categories[category].show;
      if (!self.categories[category].show) return;
      (function () { for (var p in self.categories) { if (self.categories.hasOwnProperty(p) && p != category) self.categories[p].show = false; } })();
      $http.get('/api/meetings/tags/' + category)
      .then(function (res) {
        self.categories[category].tags = res.data[category];
      })
      .catch(function (res) {
      });
    };

    self.toggle = function (tag, category) {
      var exists = self.meeting.categories[category];
      if (exists) {
        var idx = self.meeting.categories[category].indexOf(tag);
        if (idx > -1) self.meeting.categories[category].splice(idx, 1)
        else self.meeting.categories[category].push(tag)
      }
      else self.meeting.categories[category] = [tag];
    };

    self.checked = function (tag, category) {
      return self.meeting.categories[category].indexOf(tag) > -1;
    }

    function time() {
      var h = new Date().getHours();
      var m = new Date().getMinutes();
      return (h.length < 2 ? '0' + h : h) + ':' + (m.length < 2 ? '0' + m : m);
    }

  });
})();
