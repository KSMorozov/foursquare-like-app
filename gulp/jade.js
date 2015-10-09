var gulp = require('gulp');
var jade = require('gulp-jade');

gulp.task('jade', function () {
  gulp.src('./views/parts/**/*.jade')
  .pipe(jade())
  .pipe(gulp.dest('./public/templates/'));
});

gulp.task('watch:jade', function () {
  gulp.watch('views/parts/*.jade', ['jade']);
});
