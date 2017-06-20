const gulp = require('gulp');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const merge = require('merge-stream');
const process = require('process');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const gulpWebpack = require('webpack-stream');
const webpack = require('webpack');

let ASSET_PATH = '/dist/assets';

if (process.env.ENV === 'production') {
  ASSET_PATH = './dist/assets';
}

gulp.task('markup', () => {
  return gulp.src('markup/**/*.html')
    .pipe(replace(/{{([a-z]+) ([a-z]+=".*")}}/gi, (...args) => {
      const [match, type, rawAttrs, position] = args;
      const attrs = rawAttrs.split(' ').reduce((acc, attr) => {
        const [key, value] = attr.split('=');
        acc[key] = value.replace(/\"/gi, '');
        return acc;
      }, {});

      switch(type) {
        case 'asset':
          switch(attrs.type) {
            case 'style':
              return `${ASSET_PATH}/styles/app.css`;
              break;

            case 'script':
              return `${ASSET_PATH}/scripts/app.js`;
              break;
          }
          break;

        case 'image':
          return '[replaced image]';
          break;
      }

      return '';
    }))
    .pipe(gulp.dest('dist/markup/'));
});

gulp.task('images', () => {
  return gulp.src('assets/images/**/*')
    .pipe(imagemin({
      optimizationLevel: 5
    }))
    .pipe(gulp.dest('dist/assets/images'));
});

gulp.task('scripts', () => {
  return gulp.src('assets/scripts/app.js')
    .pipe(gulpWebpack(require(`./webpack-config.${process.env.ENV}`), webpack))
    .pipe(gulp.dest('dist/assets/scripts/'));
});

gulp.task('styles', () => {
  const sassStream = gulp.src('assets/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError));

  const cssStream = gulp.src([
    'node_modules/sanitize.css/sanitize.css',
  ]);

  return merge(sassStream, cssStream)
      .pipe(sourcemaps.init())
      .pipe(concat('app.css'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('dist/assets/styles/'));
});

gulp.task('watch', () => {
  gulp.watch('assets/styles/**/*', ['styles']);
  gulp.watch('assets/scripts/**/*', ['scripts']);
  gulp.watch('assets/images/**/*', ['images']);
  gulp.watch('markup/**/*.html', ['markup']);
});

gulp.task('default', [
  'markup',
  'images',
  'styles',
  'scripts',
]);
