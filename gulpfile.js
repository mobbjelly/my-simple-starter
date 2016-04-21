var gulp = require('gulp'),
  $ = require('gulp-load-plugins')();

const config = {
  styles: {
    src: ["./src/styles/main.scss"],
    dest: "./public/styles",
    autoprefix: ["last 2 version"],
    srcDirectory: ["./src/styles/**/*.{scss,css}"]
  },
  scripts: {
    src: ["./src/scripts/**/*.js"],
    dest: "./public/scripts",
    bundle: "app.js"
  }
}
  
function devWatch() {
  $.livereload.listen();
  gulp.watch('./public/*.html', gulp.series('dev:html'));
  gulp.watch(config.styles.srcDirectory, gulp.series('dev:styles'));
  gulp.watch(config.scripts.src, gulp.series('dev:scripts'));
}

function devHTML() {
    return gulp.src('./public/*.html')
      .pipe($.livereload());
}

function devSass(isProduction) {
  return () => {
    return gulp.src(config.styles.src)
    .pipe($.if(!isProduction, $.sourcemaps.init()))
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.autoprefixer())
    .pipe($.if(isProduction, $.cleanCss()))
    .pipe($.if(!isProduction, $.sourcemaps.write()))
    .pipe(gulp.dest(config.styles.dest))
    .pipe($.livereload());
  }
 }

function devScripts() {
   return gulp.src(config.scripts.src)
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write("."))
    .pipe(gulp.dest(config.scripts.dest))
    .pipe($.livereload());
}

function prodScripts() {
  return gulp.src(config.scripts.src)
    .pipe($.babel())
    .pipe($.concat(config.scripts.bundle))
    .pipe($.uglify())
    .pipe(gulp.dest(config.scripts.dest));
}

gulp.task('dev:html', devHTML);
gulp.task("dev:styles", devSass(false));
gulp.task("dev:scripts", devScripts);  
gulp.task("dev", gulp.parallel("dev:html", "dev:styles", "dev:scripts"));
gulp.task('dev:watch', gulp.series('dev', devWatch));

gulp.task('prod:styles', devSass(true));
gulp.task('prod:scripts', prodScripts);

gulp.task('prod', gulp.parallel('prod:styles', 'prod:scripts'));

gulp.task('default', gulp.series('dev', 'dev:watch'));