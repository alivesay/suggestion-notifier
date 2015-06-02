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
  return gulp.src([
    'assets/styles/**/*.{css,ttf,woff,eot,svg,woff2}',
    'assets/fonts/**/*.*'
  ])
    .pipe(gulp.dest('.tmp/public/styles'));
});

gulp.task('copyfonts', function () {
  return gulp.src('assets/fonts/**/*.*').pipe(gulp.dest('.tmp/public/styles/fonts'));
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
      'js/dependencies/jquery*.js',
      'js/dependencies/angular.js',
      'js/dependencies/**.js',
      'js/app/lib/angular-resource.min.js',
      'js/app/lib/*.js',
      'js/app/app.config.js',
      'js/app/shared.module.js',
      'js/app/shared/**/*.js',
      'js/app/components/**/*.js',
      'js/app/app.module.js',
      '**/*.js',
      'styles/lib/bootstrap.min.css',
      'styles/lib/*.css',
      'styles/app.css'
    ]));

  return gulp.src('.tmp/public/index.html')
    .pipe(inject(sources))
    .pipe(gulp.dest('.tmp/public'))
});

gulp.task('watch', function () {
  gulp.watch('assets/images/**/*.*', ['copyimages']);
  gulp.watch('assets/js/app/**/*.jade', ['templates', 'index']);
  gulp.watch('assets/js/**/*.js', ['copyjs', 'index']);
  gulp.watch('assets/styles/**/*.css', ['copystyles', 'index']);
  gulp.watch('assets/fonts/**/*.js', ['copyfonts']);
});

gulp.task('default', [
  'copyimages',
  'copyjs',
  'copystyles',
  'copyfonts',
  'templates',
  'index',
  'hapi',
  'watch'
]);