(function () {
  angular.module('FourApp')
  .controller('CategoriesDialog', function ($mdDialog, $state, $http, $scope, $rootScope) {
    var self = this;
    self.message = 'hey there it\'s categories dialog'

    self.meeting = {
      categories : {}
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
    };

    self.cancel = function () {
      $mdDialog.cancel();
    };

    self.confirm = function () {
      $rootScope.$emit('categories_for_meetings', self.meeting.categories);
      $mdDialog.hide();
    };

  });
})();
