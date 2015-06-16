var gulp = require('gulp');
var jade = require('gulp-jade');
var inject = require('gulp-inject');
var order = require('gulp-order');
var nodemon = require('gulp-nodemon');
var mainBowerFiles = require('main-bower-files');
var wiredep = require('wiredep').stream;

var config = {
  publicDir: '.tmp/public'
};

gulp.task('hapi', function() {
  nodemon({ script : './app.js', ext : 'js' });
});

gulp.task('bowerFiles', function () {
  return gulp.src(mainBowerFiles())
    .pipe(gulp.dest(config.publicDir + '/bower_components'))
});

gulp.task('copyimages', function() {
  return gulp.src(['public/images/**/*.*'])
    .pipe(gulp.dest(config.publicDir + '/images'));
});

gulp.task('copyjs', function() {
  return gulp.src(['public/js/**/*.js', 'public/js/**/*.map'])
    .pipe(order(['public/js/**/*.js',
                 'public/js/**/*.map']))
    .pipe(gulp.dest(config.publicDir + '/js'))
});

gulp.task('copystyles', function() {
  return gulp.src([
    'public/styles/**/*.{css,ttf,woff,eot,svg,woff2}',
    'public/fonts/**/*.*'
  ])
    .pipe(gulp.dest(config.publicDir + '/styles'));
});

gulp.task('copyfonts', function () {
  return gulp.src('public/fonts/**/*.*').pipe(gulp.dest(config.publicDir + '/styles/fonts'));
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
    .pipe(gulp.dest(config.publicDir));
});

gulp.task('wiredep', ['bowerFiles'], function () {
  return gulp.src(config.publicDir + '/index.html')
    .pipe(wiredep())
    .pipe(gulp.dest(config.publicDir));
});

gulp.task('index', ['copyjs', 'copystyles', 'layout'], function () {
  var sources = gulp.src('**/*.{js,css}', { cwd: config.publicDir })
    .pipe(order([
      /*
      'js/dependencies/jquery*.js',
      'js/dependencies/angular.js',
      'js/dependencies/**.js',
      'js/app/lib/angular-resource.min.js',
      'js/app/lib/*.js',
      */
      'bower_components/jquery.js',
      'bower_components/angular.js',
      'bower_components/**/*.js',
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

  return gulp.src(config.publicDir + '/index.html')
    .pipe(inject(sources))
    .pipe(gulp.dest(config.publicDir))
});

gulp.task('watch', function () {
  gulp.watch('bower_components/**/*', ['bowerFiles', 'wiredep']);
  gulp.watch('public/images/**/*.*', ['copyimages']);
  gulp.watch('public/js/app/**/*.jade', ['layout', 'index']);
  gulp.watch('public/js/**/*.js', ['copyjs', 'index']);
  gulp.watch('public/styles/**/*.css', ['copystyles', 'index']);
  gulp.watch('public/fonts/**/*.js', ['copyfonts']);
});

gulp.task('default', [
  'bowerFiles',
  'copyimages',
  'copyjs',
  'copystyles',
  'copyfonts',
  'layout',
  'wiredep',
  'index',
  'hapi',
  'watch'
]);