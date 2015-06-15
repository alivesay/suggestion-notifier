var gulp = require('gulp');
var jade = require('gulp-jade');
var inject = require('gulp-inject');
var order = require('gulp-order');
var nodemon = require('gulp-nodemon');

gulp.task('hapi', function() {
  nodemon({ script : './app.js', ext : 'js' });
});

gulp.task('copyimages', function() {
  return gulp.src(['public/images/**/*.*'])
    .pipe(gulp.dest('.tmp/public/images'));
});

gulp.task('copyjs', function() {
  return gulp.src(['public/js/**/*.js', 'public/js/**/*.map'])
    .pipe(order(['public/js/**/*.js',
                 'public/js/**/*.map']))
    .pipe(gulp.dest('.tmp/public/js'))
});

gulp.task('copystyles', function() {
  return gulp.src([
    'public/styles/**/*.{css,ttf,woff,eot,svg,woff2}',
    'public/fonts/**/*.*'
  ])
    .pipe(gulp.dest('.tmp/public/styles'));
});

gulp.task('copyfonts', function () {
  return gulp.src('public/fonts/**/*.*').pipe(gulp.dest('.tmp/public/styles/fonts'));
});

gulp.task('layout', function () {
  return gulp.src([
      'public/js/app/layout/**/*.jade',
      'public/**/*.jade',
      '!public/js/app/layout/includes/**/*.jade',
      '!public/js/app/layout/layout.jade'
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
      'js/app/app.module.js',
      'js/app/app.config.js',
      'js/app/shared.module.js',
      'js/app/shared/**/*.js',
      'js/app/directives/**/*.js',
      'js/app/modules/**/*.module.js',
      'js/app/modules/**/*.config.js',
      'js/app/modules/**/*.controller.js',
      'js/app/modules/**/*.factory.js',
      'js/app/modules/**/*.service.js',
      'styles/lib/bootstrap.min.css',
      'styles/lib/*.css',
      'styles/lib/app.css'
    ]));

  return gulp.src('.tmp/public/index.html')
    .pipe(inject(sources))
    .pipe(gulp.dest('.tmp/public'))
});

gulp.task('watch', function () {
  gulp.watch('public/images/**/*.*', ['copyimages']);
  gulp.watch('public/js/app/**/*.jade', ['layout', 'index']);
  gulp.watch('public/js/**/*.js', ['copyjs', 'index']);
  gulp.watch('public/styles/**/*.css', ['copystyles', 'index']);
  gulp.watch('public/fonts/**/*.js', ['copyfonts']);
});

gulp.task('default', [
  'copyimages',
  'copyjs',
  'copystyles',
  'copyfonts',
  'layout',
  'index',
  'hapi',
  'watch'
]);