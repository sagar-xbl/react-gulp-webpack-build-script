const gulp = require("gulp");
const fs = require('fs');
const replace = require('gulp-replace');
const webpack = require('webpack-stream');
const del = require('del');

// gulp.task('default', ['copy-src', 'replace-env', 'build', 'clean']);
gulp.task('default', ['clean']);

gulp.task('copy-src', function () {
    return gulp.src('src/**')
        .pipe(gulp.dest('temp'));
});

const ENV_KEYS = ['WEB_URL_BASE_CONST', 'WALLET_URL_BASE_CONST', 'TRADING_CHART_DATA_URL_BASE_CONST'];

gulp.task('replace-env', ['copy-src'], () => {
    let task = gulp.src(['./src/constants/web.const.js']);
    ENV_KEYS.forEach((key) => {
        task = task.pipe(replace(key, "'" + process.env[key] + "'"));
    });
    return task.pipe(gulp.dest('./temp/constants'));
});

gulp.task('build', ['replace-env'],  () => {
    return gulp.src(['./temp/index.js'])
        .pipe(webpack(require('./config/webpack.config.prod.js')))
        .pipe(gulp.dest('dist/'));
});

gulp.task('clean', ['build'], function(){
    return del('./temp/**', {force:true});
});

// dummy env values
const setEnvValues = () => {
    process.env.NODE_ENV = 'production';
    for (const key of ENV_KEYS) {
        process.env[key] = 'Sample value / url';
    }
}
setEnvValues();