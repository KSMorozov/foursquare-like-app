(function () {
  angular.module('FourApp')
  .controller('NewMeetingController', function ($http, $window, $scope, $mdToast,
                                                Account, Utils, Meeting, Toast) {
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
      place      : '',
      categories : [],
      tags       : []
    };

    self.create_meeting = function () {
      Meeting.create_meeting(self.meeting)
      .then(function (res) {
        Toast.show_toast('success', res.data.message);
        // redirect to specific meeting route
        // id of meeting available at res.data.message_id
      })
      .catch(function (res) {
        Toast.show_toast('failed', res.data.message);
      });
      self.meeting = {};
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
      Utils.fetch_tags_for_category(category)
      .then(function (res) {
        self.categories[category].tags = res.data.tags;
      });
    };

    self.toggle = function (tag, category) {
      var idx_tag = self.meeting.tags.indexOf(tag);
      if (idx_tag > -1) self.meeting.tags.splice(idx_tag, 1);
      else self.meeting.tags.push(tag);

      var idx_cat = self.meeting.categories.indexOf(category);
      var liable  = self.meeting.tags.filter(function (e) {
        return self.categories[category].tags.indexOf(e) > -1;
      }).length;

      if (!liable) self.meeting.categories.splice(idx_cat, 1);
      else if (self.meeting.categories.indexOf(category) === -1) {
        self.meeting.categories.push(category);
      }
    };

    self.checked = function (tag, category) {
      return self.meeting.tags.indexOf(tag) > -1;
    };

  });
})();
