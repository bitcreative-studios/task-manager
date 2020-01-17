import path from "path"
import gulp, { src, dest, series, parallel } from "gulp"
import bs from "browser-sync"
import sourcemaps from "gulp-sourcemaps"
import sass from "gulp-sass"
import postCss from "gulp-postcss"
import autopreFixer from "autoprefixer"
import cssNano from "cssnano"
import concat from "gulp-concat"
import uglify from "gulp-uglify"

const APPLICATION_ROOT = path.resolve(__dirname, "src")
const HTML_FILES = `${APPLICATION_ROOT}/*.html`
const SASS_SOURCE_FILES = path.resolve(__dirname, "src/scss/**/*.scss")
const JS_SOURCE_FILES = path.resolve(__dirname, "..", "src/js/**/*.js")

const browserSync = bs.create()

/**
 * The process of compiling scss source files to css files
 * 1. read all your scss files as a stream with gulp
 * 2. generate sourcempas before compiling the sass
 * 3. compile the ass
 * 4. add 'post processing'
 *   - postcss([autoprefixer,cssnano]) add vendor prefixes --> minify
 * 5. at this point sass is compiled we need to write our sourcemaps (keep in same directory - this is a choice)
 * 6. write the transformed stream to disc
 */

const sassTask = () => {
  return src(SASS_SOURCE_FILES)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(postCss([autopreFixer, cssNano]))
    .pipe(sourcemaps.write("."))
    .pipe(dest(`${APPLICATION_ROOT}/css`))
    .pipe(browserSync.stream())
}

const jsTask = () => {
  return src(JS_SOURCE_FILES)
    .pipe(concat("bundle.js"))
    .pipe(uglify())
    .pipe(dest("public"))
}

const watch = () => {
  browserSync.init({
    server: {
      baseDir: APPLICATION_ROOT,
    },
  })
  gulp.watch(SASS_SOURCE_FILES, sassTask)
  gulp.watch(JS_SOURCE_FILES).on("change", browserSync.reload)
  gulp.watch(HTML_FILES).on("change", browserSync.reload)
}

exports.sass = sassTask
exports.watch = watch
