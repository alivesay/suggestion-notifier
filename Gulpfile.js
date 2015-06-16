var gulp = require('gulp');
var jade = require('gulp-jade');
var inject = require('gulp-inject');
var order = require('gulp-order');
var nodemon = require('gulp-nodemon');
var wiredep = require('wiredep');
var mainBowerFiles = require('main-bower-files');
var flatten = require('gulp-flatten');

var config = {
  publicDir: '.tmp/public'
};

gulp.task('hapi', function() {
  nodemon({ script : './app.js', ext : 'js' });
});

gulp.task('bowerjs', function () {
  return gulp.src(wiredep().js)
    .pipe(gulp.dest(config.publicDir + '/js/vendor'))
});

gulp.task('bowercss', function () {
  return gulp.src(wiredep().css)
    .pipe(gulp.dest(config.publicDir + '/styles/vendor'))
});

gulp.task('bowerfiles', function () {
  // Workaround for: https://github.com/zont/gulp-bower/issues/30

  gulp.src('./bower_components/**/*.css.map')
    .pipe(flatten())
    .pipe(gulp.dest(config.publicDir + '/styles/vendor'));

  gulp.src('./bower_components/**/*.js.map')
    .pipe(flatten())
    .pipe(gulp.dest(config.publicDir + '/js/vendor'));

  gulp.src(mainBowerFiles('**/font-awesome/fonts/*'))
    .pipe(gulp.dest(config.publicDir + '/styles/fonts'));

  return gulp.src(mainBowerFiles('**/angular-ui-grid/{*.eot,*.svg,*.ttf,*.woff,*.woff2}'))
    .pipe(gulp.dest(config.publicDir + '/styles/vendor'));
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

gulp.task('wiredep', ['bowerjs', 'bowercss'], function () {
  return gulp.src(config.publicDir + '/index.html')
    .pipe(wiredep.stream({
      fileTypes: {
        html: {
          replace: {
            js: function (filePath) {
              return '<script src="/js/vendor/' + filePath.split('/').pop() + '"></script>';
            },
            css: function (filePath) {
              return '<link rel="stylesheet" href="/styles/vendor/' + filePath.split('/').pop() + '" />';
            }
          }
        }
      }
    }))
    .pipe(gulp.dest(config.publicDir));
});

gulp.task('index', ['copyjs', 'copystyles', 'layout'], function () {
  var sources = gulp.src([
      '**/*.{js,css}',
      '!js/vendor/**/*',
      '!styles/vendor/**/*'
    ]
    , { cwd: config.publicDir })
    .pipe(order([
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
  gulp.watch('bower_components/**/*', ['bowerfiles', 'bowerjs', 'bowercss', 'wiredep']);
  gulp.watch('public/images/**/*.*', ['copyimages']);
  gulp.watch('public/js/app/**/*.jade', ['layout', 'index', 'wiredep']);
  gulp.watch('public/js/**/*.js', ['copyjs', 'index', 'wiredep']);
  gulp.watch('public/styles/**/*.css', ['copystyles', 'index', 'wiredep']);
});

gulp.task('default', [
  'bowerfiles',
  'copyimages',
  'copyjs',
  'copystyles',
  'layout',
  'wiredep',
  'index',
  'hapi',
  'watch'
]);