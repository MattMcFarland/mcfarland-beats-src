'use strict';

var gulp = require('gulp'),
    hb = require('gulp-hb'),
    rename = require('gulp-rename'),
    rsync = require('gulp-rsync'),
    copy = require('gulp-copy'),
    data = require('./src/assets/data/tracks.json'),
    trackTasks = [],
    devserver = require('gulp-webserver'),
    processTrackTask = function (track) {
        gulp.src('./src/assets/track.hbs')
            .pipe(hb({
                data: track,
                helpers: './src/assets/helpers/*.js',
                partials: './src/assets/partials/**/*.hbs'
            }))
            .pipe(rename(track.permalink + '.html'))
            .pipe(gulp.dest('./web/tracks'));
    };


data.tracks.forEach(function (track, i) {
    var taskName = 'create-track-' + track.permalink;
    gulp.task(taskName, processTrackTask(track));
    trackTasks.push(taskName);
});

gulp.task('create-tracks', trackTasks);

gulp.task('static-files', function () {
    return gulp.src('./src/_static/**/*.*')
        .pipe(copy('./web', { prefix: 2}));
});

gulp.task('create-pages', function () {
    return gulp
        .src('./src/assets/pages/*.hbs')
        .pipe(hb({
            data: './src/assets/data/*.json',
            helpers: './src/assets/helpers/*.js',
            partials: './src/assets/partials/**/*.hbs'
        }))
        .pipe(rename(function (path) {
            path.extname=".html"
        }))
        .pipe(gulp.dest('./web/'));
});



gulp.task('serve', function() {
    gulp.src('./web')
        .pipe(devserver({
            livereload: true,
            directoryListing: true,
            open: true
        }));
});


gulp.task('deploy', function () {
   gulp.src('./web/**/*.*')
       .pipe(rsync({
           hostname: 'mattmcfarland.healthwyze.org',
           destination: '/aa/hosted/mattmcfarland.com',
           relative: false,
           port: 777,
           username: 'matt'
       }))
});

gulp.task('default', ['create-tracks', 'create-pages', 'static-files']);