var gulp = require('gulp')
  , stylus = require('gulp-stylus')
  , concat = require('gulp-concat')
  , nib = require('nib')

  , paths =
    { js:
      { angular:
        [ 'public/js/lib/angularjs/angular.js'
        , 'public/js/lib/angularjs/angular-animate.js'
        , 'public/js/lib/angularjs/angular-route.js'
        , 'public/js/lib/angularjs/angular-sanitize.js'
        , 'public/js/lib/angularjs/angular-cookies.js'
        , 'public/js/lib/angularjs/ui-bootstrap-custom-tpls-0.10.0.js'
        , 'public/js/lib/angularjs/select2.js'
        ]
      , site:
        [ 'lib/routing-config.js'
        , 'public/js/app/app.js'
        , 'public/js/app/services/title.js'
        , 'public/js/app/services/user.js'
        , 'public/js/app/services/meal-plan.js'
        , 'public/js/app/services/error-interceptor.js'
        , 'public/js/app/controllers/meta.js'
        , 'public/js/app/controllers/error.js'
        , 'public/js/app/controllers/header.js'
        , 'public/js/app/controllers/sign-in.js'
        , 'public/js/app/controllers/register.js'
        , 'public/js/app/controllers/meal-planner.js'
        , 'public/js/app/controllers/meal-plans.js'
        , 'public/js/app/directives/recipe-rating.js'
        , 'public/js/app/directives/access-level.js'
        , 'public/js/app/directives/register.js'
        , 'public/js/app/directives/sign-in.js'
        , 'public/js/app/directives/sign-out.js'
        , 'public/js/app/directives/meal-planner.js'
        ]
      , plugins:
        [ 'public/js/lib/jquery.js'
        , 'public/js/lib/md5.js'
        , 'public/js/lib/select2.js'
        , 'public/js/lib/nprogress.js'
        ]
      }
    }

  // Stylus Options
  , stylusOptions =
    { set: ['compress']
    , use: nib()
    }

gulp.task('scripts', function () {

  gulp.src(paths.js.angular)
    .pipe(concat('angular.js'))
    .pipe(gulp.dest('public/js/'))

  gulp.src(paths.js.site)
    .pipe(concat('app.js'))
    .pipe(gulp.dest('public/js/'))

  gulp.src(paths.js.plugins)
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest('public/js/'))

})

gulp.task('stylus', function () {
  gulp.src('public/stylus/style.styl')
    .pipe(stylus(stylusOptions))
    .pipe(gulp.dest('public/stylesheets/'))
})


// Watch
gulp.task('watch', function () {

  // Scripts
  gulp.watch('public/js/app/**/*.js', ['scripts'])

  // Stylus
  gulp.watch('public/stylus/**/*', ['stylus'])

})

// Default task
gulp.task('default', ['scripts', 'stylus', 'watch' ])

// Build all
gulp.task('build', ['scripts', 'stylus'] )