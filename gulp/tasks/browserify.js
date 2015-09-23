/* browserify task
   ---------------
   Bundle javascripty things with browserify!

   If the watch task is running, this uses watchify instead
   of browserify for faster bundling using caching.
*/

var _            = require("lodash"),
    browserify   = require('browserify'),
     
    bundleLogger = require('../util/bundleLogger'),
    gulp         = require('gulp'),
    handleErrors = require('../util/handleErrors'),
    source       = require('vinyl-source-stream'),

    transform    = require('vinyl-transform'),
    concat       = require('gulp-concat'),

    uglify       = require("gulp-uglify"),
    streamify    = require("gulp-streamify"),
    gulpif       = require("gulp-if"),
    env          = global.env,
    buildMode    = global.buildMode,
    path         = global.path;


    browserify({
      require : { jquery : 'jquery-browserify' }
    });

var globals = ["jquery", "lodash"];

gulp.task("js", ["js-global", "js-common", "js-pages"]);

gulp.task("js-global", function(){
  var b = browserify();
 return b
 .require(globals)
 .bundle()
 .on('error', handleErrors)
 .pipe(source("global.js"))
 .pipe(gulpif(buildMode !== "debug", streamify(uglify())))
 .pipe(gulp.dest(path + "/scripts"));
});



gulp.task("js-common", ["js-global"], function(){
  browserified = transform(function(filename) {
    b = browserify(filename, { debug: buildMode === "debug" });
    _.forEach(globals, function(item){
      b.external(item);
    });
    
    return b.bundle();
  });

  return gulp.src(["./source/scripts/utils/**/*.js", "!./source/scripts/pages/**/*.js"])
     .pipe(browserified)
     .pipe(gulpif(buildMode !== "debug", uglify()))
     .pipe(concat('common.js'))
     .pipe(gulp.dest(path + "/scripts"));
});

gulp.task("js-pages", ["js-common"], function(){
  browserified = transform(function(filename) {
    b = browserify(filename, { debug: buildMode === "debug" });
    _.forEach(globals, function(item){
      b.external(item);
    });  
    b.external("say-hello");
    return b.bundle();
  });

  return gulp.src("./source/scripts/pages/**/*.js")
     .pipe(browserified)
     .pipe(gulpif(buildMode !== "debug", uglify()))
     .pipe(gulp.dest(path + "/scripts"));
});