import gulp from 'gulp'
import babel from 'gulp-babel'
var sass = require('gulp-sass')(require('sass'))
import sourcemaps from 'gulp-sourcemaps'
import prefix from 'gulp-autoprefixer'
import terser from 'gulp-terser'
import optimize from 'gulp-image'
import minify from 'gulp-imagemin'
import concat from 'gulp-concat'
import uglify from 'gulp-uglify'
import del from 'del'
var browserSync = require('browser-sync').create()

// change to your source directory
const paths = {
    css: {
        src : 'src/scss/app.scss',
        dest: 'dist/css'
    },
    js: {
        src : 'src/js/**/*.{js,json}',
        dest: 'dist/js'
    },
    images: {
        src : 'src/img/**/*.{jpg,png,jpeg,json,ico}',
        dest: 'dist/img'
    },
    fonts: {
        src : 'src/fonts/*',
        dest: 'dist/fonts'
    },
    fontAwesome: {
        src : 'node_modules/@fortawesome/fontawesome-free/webfonts/*',
        dest: 'dist/fonts'
    }
};

export const clean = () => del([ 'dist' ]);

/**
 * 
 * @returns compile, prefix, rename and minify scss
 */
export function scss() {
    return gulp.src(paths.css.src)
        .pipe(sourcemaps.init())
        .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(prefix('last 2 versions'))
        .pipe(concat('app.min.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.css.dest))
        .pipe(browserSync.stream())
}

/**
 * 
 * @returns minify js
 */
export function js() {
    return gulp.src(paths.js.src, { sourcemaps: true })
        //.pipe(babel())
        .pipe(terser())
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest(paths.js.dest))
}

/**
 * 
 * @returns Optimize and Minify all images
 */
export function image() {
    return gulp.src(paths.images.src)
        .pipe(optimize({
            pngquant: true,
            optipng: false,
            zopflipng: true,
            jpegRecompress: false,
            mozjpeg: true,
            gifsicle: true,
            svgo: true,
            concurrent: 10,
            quiet: false // defaults to false
        }))
        .pipe(minify([
            minify.mozjpeg({ quality: 30, progressive: true }),
            minify.optipng({ optimizationLevel: 2 }),
        ]))
        .pipe(gulp.dest(paths.images.dest))
};

/**
 * 
 * @returns Move all fonts
 */
export function fonts() {
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest))
}

/**
 * 
 * @returns Move font-awesome fonts
 */
export function fontawesome() {
    return gulp.src(paths.fontAwesome.src)
        .pipe(gulp.dest(paths.fontAwesome.dest))
}

/**
 * 
 * @returns watch
 */
function watch(){
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    gulp.watch(paths.css.src, scss);
    gulp.watch("./*.html").on('change', browserSync.reload);
    gulp.watch(paths.js.src, js);
    gulp.watch("./js/**/.js").on('change', browserSync.reload);
    gulp.watch(paths.images.src, image);
    gulp.watch(paths.fonts.src, fonts);
    gulp.watch(paths.fontAwesome.src, fontawesome); 
}

const build = gulp.series(clean, gulp.parallel(scss, js, image, fonts, fontawesome, watch));

/*
 * Export a default build
 */
export default build;