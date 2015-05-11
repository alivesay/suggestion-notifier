var gulp = require('gulp');
var jade = require('gulp-jade');
var order = require('gulp-order');
var livereload = require('gulp-livereload');
var tinylr = require('tiny-lr');
var nodemon = require('gulp-nodemon');

var tinyserver = tinylr();

gulp.task('hapi', function() {
  nodemon({ script : './app.js', ext : 'js' });
});

gulp.task('copyjs', function() {
  return gulp.src(['assets/js/**/*.js', 'assets/js/**/*.map'])
    .pipe(order(['assets/js/**/*.js',
                 'assets/js/**/*.map']))
    .pipe(gulp.dest('.tmp/public/js'));
});

gulp.task('copystyles', function() {
  return gulp.src('assets/styles/**/*.css')
    .pipe(gulp.dest('.tmp/public/styles'));
});

gulp.task('templates', function () {
  return gulp.src([
      'assets/templates/**/*.jade',
      '!assets/templates/includes/**/*.jade',
      '!assets/templates/layout.jade'
    ]).pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('.tmp/public'))
    .pipe(livereload(tinyserver));
});

gulp.task('index', ['copyjs', 'copystyles'], function () {

});

gulp.task('watch', function () {
  tinyserver.listen(35729, function (err) {
    if (err) {
      return console.log(err);
    }
    
    gulp.watch('assets/templates/*.jade', ['templates', 'index']);
    gulp.watch('assets/js/**/*.js', ['copyjs', 'index']);
    gulp.watch('assets/styles/**/*.css', ['copystyles']);

  });
});

gulp.task('default', [
  'copyjs',
  'copystyles',
  'templates',
  'hapi',
  'watch'
]);