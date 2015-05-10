var gulp = require('gulp');
var jade = require('gulp-jade');
var livereload = require('gulp-livereload');
var tinylr = require('tiny-lr');
var nodemon = require('gulp-nodemon');

var tinyserver = tinylr();

gulp.task('hapi', function() {
  nodemon({ script : './app.js', ext : 'js' });
});

gulp.task('views', function () {
  return gulp.src('assets/views/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('.tmp/public'))
    .pipe(livereload(tinyserver));
});

gulp.task('watch', function () {
  tinyserver.listen(35729, function (err) {
    if (err) {
      return console.log(err);
    }
    
    gulp.watch('assets/views/*.jade', ['views']);
  });
});

gulp.task('default', ['views', 'hapi', 'watch']);