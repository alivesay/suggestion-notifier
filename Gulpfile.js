var gulp = require('gulp');
var jade = require('gulp-jade');
var inject = require('gulp-inject');
var order = require('gulp-order');
var nodemon = require('gulp-nodemon');

gulp.task('hapi', function() {
  nodemon({ script : './app.js', ext : 'js' });
});

gulp.task('copyimages', function() {
  return gulp.src(['assets/images/**/*.*'])
    .pipe(gulp.dest('.tmp/public/images'));
});

gulp.task('copyjs', function() {
  return gulp.src(['assets/js/**/*.js', 'assets/js/**/*.map'])
    .pipe(order(['assets/js/**/*.js',
                 'assets/js/**/*.map']))
    .pipe(gulp.dest('.tmp/public/js'))
});

gulp.task('copystyles', function() {
  return gulp.src('assets/styles/**/*.{css,ttf,woff}')
    .pipe(gulp.dest('.tmp/public/styles'));
});

gulp.task('templates', function () {
  return gulp.src([
      'assets/js/app/templates/**/*.jade',
      'assets/**/*.jade',
      '!assets/js/app/templates/includes/**/*.jade',
      '!assets/js/app/templates/layout.jade'
    ])
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('.tmp/public'));
});

gulp.task('index', ['copyjs', 'copystyles'], function () {
  var sources = gulp.src('**/*.{js,css}', { cwd: '.tmp/public' })
    .pipe(order([
      'js/dependencies/angular.min.js',
      'js/dependencies/**.js',
      'js/app/lib/angular-resource.min.js',
      'js/app/lib/*.js',
      'js/app/app.js',
      'js/app/shared/**/*.js',
      'js/app/modules/**/*.js',
      '**/*.js',
      '**/*.css'
    ]));

  return gulp.src('.tmp/public/index.html')
    .pipe(inject(sources))
    .pipe(gulp.dest('.tmp/public'))
});

gulp.task('watch', function () {
  gulp.watch('assets/images/**/*.*', ['copyimages']);
  gulp.watch('assets/js/app/templates/**/*.jade', ['templates', 'index']);
  gulp.watch('assets/js/app/shared/**/*.jade', ['templates', 'index']);
  gulp.watch('assets/js/app/modules/**/*.jade', ['templates', 'index']);
  gulp.watch('assets/js/**/*.js', ['copyjs', 'index']);
  gulp.watch('assets/styles/**/*.css', ['copystyles', 'index']);
});

gulp.task('default', [
  'copyimages',
  'copyjs',
  'copystyles',
  'templates',
  'index',
  'hapi',
  'watch'
]);