(function () {
  angular.module('FourApp')
  .controller('CategoriesDialog', function ($mdDialog, $state, $http, $scope, $rootScope, Utils) {
    var self = this;

    self.meeting = {
      categories : [],
      tags       : []
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

    self.cancel = function () {
      $mdDialog.cancel();
    };

    self.confirm = function () {
      $rootScope.$emit('apply_tags', self.meeting);
      $mdDialog.hide();
    };

  });
})();
