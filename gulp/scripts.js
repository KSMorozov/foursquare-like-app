var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('scripts', function () {
  gulp.src(['ng/module.js', 'ng/**/*.js'])
  .pipe(concat('app.js'))
  .pipe(gulp.dest('public/javascripts'));
});

gulp.task('watch:scripts', ['scripts'], function () {
  gulp.watch('ng/**/*.js', ['scripts']);
});
