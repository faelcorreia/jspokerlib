var gulp = require("gulp")
var browserify = require("gulp-browserify")
var rename = require("gulp-rename")

gulp.task("browser", function() {
    gulp.src("src/jspokerlib.js")
        .pipe(browserify())
        .pipe(rename("jspokerlib.js"))
        .pipe(gulp.dest("./browser"))
})