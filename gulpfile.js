var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

gulp.task('default', function () {
    console.log('stuff');
});

gulp.task('concat', function () {
    var src = [
        'data/*.js',
        'lib/*.js',
        'objects/*.js',
        'scenes/*.js'
    ];
    return gulp.src(src).pipe(concat('lets-build-bridges.js'))
                        .pipe(gulp.dest('dist'));
});


gulp.task('compress', function () {
    // TODO: source map
    return gulp.src('dist/lets-build-bridges.js')
               .pipe(uglify())
               .pipe(rename('lets-build-bridges.min.js'))
               .pipe(gulp.dest('dist'));
});
