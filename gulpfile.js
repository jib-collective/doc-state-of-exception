const awspublish = require('gulp-awspublish');
const cloudfront = require('gulp-cloudfront-invalidate');
const concat = require('gulp-concat');
const cssnano = require('gulp-cssnano');
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const gulpWebpack = require('webpack-stream');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const merge = require('merge-stream');
const parallelize = require('concurrent-transform');
const process = require('process');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack');

const ENV = process.env.ENV || 'dev';
const s3Config = require('./aws.json').s3;
const cloudfrontConfig = {
  accessKeyId: s3Config.accessKeyId,
  secretAccessKey: s3Config.secretAccessKey,
  region: s3Config.region,
  bucket: s3Config.bucket,
  distribution: require('./aws.json').cloudfront.distributionId,
  paths: [
    '/state-of-exception/dist/*',
  ],
};

let ASSET_PATH = '/dist/assets';

if (ENV === 'production') {
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
    .pipe(gulpIf(ENV === 'production', htmlmin()))
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
    .pipe(gulpWebpack(require(`./webpack-config.${ENV}`), webpack))
    .pipe(gulp.dest('dist/assets/scripts/'));
});

gulp.task('styles', () => {
  const sassStream = gulp.src('assets/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError));

  const cssStream = gulp.src([
    'node_modules/sanitize.css/sanitize.css',
  ]);

  return merge(sassStream, cssStream)
      .pipe(gulpIf(ENV !== 'production', sourcemaps.init()))
      .pipe(concat('app.css'))
      .pipe(gulpIf(ENV === 'production', cssnano()))
      .pipe(gulpIf(ENV !== 'production', sourcemaps.write()))
      .pipe(gulp.dest('dist/assets/styles/'));
});

gulp.task('upload', ['styles', 'scripts', 'images', 'markup'], () => {
  let publisher = awspublish.create(s3Config);
  const cacheTime = (60 * 60 * 24) * 14; // 14 days
  const awsHeaders = {
    'Cache-Control': `public, max-age=${cacheTime}, s-maxage=${cacheTime}`,
  };
  const gzippable = function(file) {
    const match = file.path.match(/\.(svg|json|geojson|vtt|html|css|js)$/gi);
    return match;
  };

  return gulp.src([
    './dist/**/*',
  ])
    .pipe(rename((path) => {
        path.dirname = `/state-of-exception/dist/${path.dirname}`;
        return path;
    }))
    .pipe(gulpIf(gzippable, awspublish.gzip()))
    .pipe(publisher.cache())
    .pipe(parallelize(publisher.publish(awsHeaders), 10))
    .pipe(awspublish.reporter())
    .pipe(cloudfront(cloudfrontConfig));
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
