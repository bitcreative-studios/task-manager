import autopreFixer from "autoprefixer"
import bs from "browser-sync"
import concat from "gulp-concat"
import cssNano from "cssnano"
import deporder from "gulp-deporder"
import gulp, { src, dest, series, parallel } from "gulp"
import noop from "gulp-noop"
import path from "path"
import postCss from "gulp-postcss"
import sass from "gulp-sass"
import terser from "gulp-terser"
import uglify from "gulp-uglify"

const DEVELOPMENT = process.env.NODE_ENV !== "production"
const stripDebug = DEVELOPMENT ? null : require("gulp-strip-debug")
const sourcemaps = DEVELOPMENT ? require("gulp-sourcemaps") : null

const APPLICATION_ROOT = path.resolve(__dirname, "src")
const PUBLIC_ROOT = path.resolve(__dirname, "public")
const HTML_FILES = `${APPLICATION_ROOT}/*.html`
const SASS_SOURCE_FILES = path.resolve(__dirname, "src/scss/**/*.scss")
const JS_SOURCE_FILES = path.resolve(__dirname, "src/js/**/*.js")
const VENDOR_FILES = path.resolve(__dirname, "src/vendors/**/*.js")

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

const html = () => {
  return src(HTML_FILES).pipe(dest(PUBLIC_ROOT))
}

const css = () => {
  return src(SASS_SOURCE_FILES)
    .pipe(sourcemaps ? sourcemaps.init() : noop())
    .pipe(sass().on("error", sass.logError))
    .pipe(postCss([autopreFixer, cssNano]))
    .pipe(sourcemaps ? sourcemaps.write(".") : noop())
    .pipe(dest(`${PUBLIC_ROOT}/css`))
    .pipe(browserSync.stream())
}

const js = () => {
  return src(JS_SOURCE_FILES)
    .pipe(sourcemaps ? sourcemaps.init() : noop())
    .pipe(deporder())
    .pipe(concat("bundle.js"))
    .pipe(stripDebug ? stripDebug() : noop())
    .pipe(terser())
    .pipe(sourcemaps ? sourcemaps.write() : noop())
    .pipe(dest(PUBLIC_ROOT))
}

const watch = () => {
  browserSync.init({
    server: {
      baseDir: PUBLIC_ROOT,
    },
  })
  gulp.watch(SASS_SOURCE_FILES, css)
  gulp.watch(JS_SOURCE_FILES).on("change", browserSync.reload)
  gulp.watch(HTML_FILES).on("change", () => {
    src(HTML_FILES).pipe(dest(PUBLIC_ROOT))
    browserSync.reload()
  })
}
const build = parallel(html, css, js, () =>
  src(VENDOR_FILES).pipe(dest(`${PUBLIC_ROOT}/vendors`))
)

exports.build = build
exports.default = series(build, watch)
exports.sass = css
exports.watch = watch
exports.js = js
