var _ = require("lodash"),
	requireDir = require('require-dir'),
	gulp = require("gulp"),
	jade = require("gulp-jade"),
	packager = require('./lib/packager')({debug: true}),
     concat       = require('gulp-concat'),
	source = require("vinyl-source-stream"),
	buffer = require("vinyl-buffer"),
	uglify = require("gulp-uglify"),
	streamify = require("gulp-streamify"),
	gulpif = require("gulp-if"),
	sass = require("gulp-ruby-sass"),
	env = process.env.NODE_ENV || "development", //SET NODE_ENV targetenvironment
	buildMode = (env === "development") ? "debug" : "release",
	path = "bin/" + buildMode;
console.log(path);

global.env = process.env.NODE_ENV || "development"; //SET NODE_ENV targetenvironment
global.buildMode = (env === "development") ? "debug" : "release";
global.path = "bin/" + buildMode;

requireDir('./gulp/tasks', {
	recurse: true
});

gulp.task("jade", function() {
	return gulp.src("source/templates/**/*.jade")
		.pipe(jade())
		.pipe(gulp.dest(path));
});

gulp.task('sass', function() {
	var config = {};
	if (buildMode === "debug") {
		config.lineNumbers = true;
	}

	if (buildMode === "release") {	
		config.sourcemap = false;
		config.style = "compressed";
	}

	return gulp.src('./source/styles/main.scss')
		.pipe(sass(config))
		.pipe(gulp.dest(path + "/styles"));
});

gulp.task("default", ["jade", "js", "sass"]);