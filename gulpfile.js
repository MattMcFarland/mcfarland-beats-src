'use strict';

var gulp = require('gulp'),
    hb = require('gulp-hb'),
    rename = require('gulp-rename'),
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
    var taskName = 'create-track-' + i;
    gulp.task(taskName, processTrackTask(track));
    trackTasks.push(taskName);
});

gulp.task('create-tracks', trackTasks);

gulp.task('static-files', function () {
    var gulpCopy = require('gulp-copy');
    return gulp.src('./src/_static/**/*.*')
        .pipe(gulpCopy('./web', { prefix: 2}));
})