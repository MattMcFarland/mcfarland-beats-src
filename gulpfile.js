'use strict';

var gulp = require('gulp'),
    hb = require('gulp-hb'),
    rename = require('gulp-rename'),
    copy = require('gulp-copy'),
    data = require('./src/assets/data.json'),
    trackTasks = [],
    processTrackTask = function (track) {
        gulp.src('./src/track.hbs')
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

gulp.task('default', ['create-tracks', 'static-files']);