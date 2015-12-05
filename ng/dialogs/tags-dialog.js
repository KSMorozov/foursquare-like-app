(function () {
  angular.module('FourApp')
    .controller('Tags', function ($scope, $rootScope, $timeout, Category) {
      $scope.meeting = {
        tags : [],
        categories : []
      };

      function close_modal() {
        $timeout(function () {
          $('#tags-modal').closeModal();
        }, 0, false);
      }

      self.fetch_categories = function () {
        Category.fetch_categories()
        .then(function (res) {
          $scope.categories = res.data;
        })
        .catch(function (res) {
          Toast.show_toast('fail', res.data.message || 'Не удалось получить категории');
        });
      };

      $scope.select_category = function (name) {
        $scope.category_selected = name;
      };

      $scope.is_selected_category = function (name) {
        return $scope.category_selected === name;
      };

      $scope.is_checked_tag = function (name) {
        return $scope.meeting.tags.indexOf(name) > -1;
      };

      $scope.check_tag = function (name, category) {
        var idx = $scope.meeting.tags.indexOf(name);
        if (idx > -1) {
          $scope.meeting.tags.splice(idx, 1);
        } else $scope.meeting.tags.push(name);

        idx = $scope.meeting.categories.indexOf(category);

        var category_index;
        $scope.categories.forEach(function (e, i) {if (e.name === category) {category_index = i;}});
        var gone = true;
        $scope.meeting.tags.forEach(function (e) {if ($scope.categories[category_index].tags.indexOf(e) > -1) gone = false;});
        if (gone) $scope.meeting.categories.splice(idx, 1);
        else if ($scope.meeting.categories.indexOf(category) === -1) $scope.meeting.categories.push(category);
      };

      $scope.apply_tags = function (apply) {
        close_modal();
        if (!apply) return;

        // apply_categories_tags
        $rootScope.$emit('apply_categories_tags', {
          tags : $scope.meeting.tags,
          categories : $scope.meeting.categories
        });

        $scope.meeting = {
          tags : [],
          categories : []
        };
      };

      // watching tags
      // $scope.$watch(function () {
      //   return [$scope.meeting.tags, $scope.meeting.categories];
      // }, function (new_value, old_value) {
      //   if (!new_value[0] || !new_value[1]) return ;
      //   $rootScope.$emit('apply_categories_tags', {
      //     tags : new_value[0],
      //     categories : new_value[1]
      //   });
      // });

      self.fetch_categories();
    });
})();
