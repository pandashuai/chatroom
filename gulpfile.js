var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function () {
  gulp.src('./public/sass/*.sass')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/stylesheets'));
});
 
gulp.task('sass_watch', function () {
  gulp.watch('./public/sass/*.sass', ['sass']);
});

gulp.task('default', ['sass_watch', 'sass']);