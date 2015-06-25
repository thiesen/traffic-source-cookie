var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var notify = require('gulp-notify');

gulp.task('test', function() {
  gulp.src('./test/*.js')
  .pipe(jasmine())
  .on('error', notify.onError({
    title: 'Test failure',
    message: 'One or more tests failed. See the cli for details.'
  }));
});
