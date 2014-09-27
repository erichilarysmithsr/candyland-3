var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    rimraf = require('gulp-rimraf'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    nodemon = require('gulp-nodemon');

// Other browsers not officially supported
var AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

gulp.task('clean', function() {
    return gulp.src('public/assets').pipe(rimraf({ force: true }));
});

gulp.task('styles', function() {
    return gulp.src('./ui-src/styles/candyland.scss')
        .pipe(sass({ style: 'expanded', require: ['bourbon', 'neat'], loadPath: ['./ui-src/styles'] }))
        .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
//        .pipe(minifycss())
        .pipe(gulp.dest('./public/assets/styles'))
});

gulp.task('scripts', function() {
    return browserify('./ui-src/scripts/index.js')
        .bundle()
        .pipe(source('candyland.js'))
        .pipe(gulp.dest('./public/assets/scripts'));
});

gulp.task('modernizr', function() {
    return gulp.src('./ui-src/scripts/vendor/modernizr.js')
        .pipe(uglify())
        .pipe(gulp.dest('./public/assets/scripts'));
});

gulp.task('images', function() {
    return gulp.src('./ui-src/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
        .pipe(gulp.dest('./public/assets/images'));
});

gulp.task('fonts', function() {
    return gulp.src('./ui-src/fonts/**/*')
        .pipe(gulp.dest('./public/assets/fonts'));
});

gulp.task('default', ['clean'], function() {
   gulp.start(['styles', 'scripts', 'images', 'fonts'])
});

gulp.task('watch', function() {
    // Watch .scss files
    gulp.watch('./ui-src/styles/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('./ui-src/scripts/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('./ui-src/images/**/*', ['images']);

    // After compliation reload
    gulp.watch('./public/assets/**/*').on('change', livereload.changed);

    // Watch server for change
    nodemon({script: 'server.js', ext: 'hbs js' , env: { 'NODE_ENV': 'development' }}).on('restart', livereload.changed);
});

gulp.task('serve', ['watch'], function() {
    livereload.listen();
});
