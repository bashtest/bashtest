var ftpSettings = {
    host: '162.243.150.185',
    user: 'irandek',
    pass: '7a86sdgd5',
    remotePath: 'irandek'
}

var gulp = require('gulp');
var jade = require('gulp-jade');
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var ftp = require('gulp-ftp');

gulp.task('default', function(){
    watch('*.jade', function(){ gulp.start('jade'); });
    watch('*.js')
});

gulp.task('jade', function(){
	return gulp.src('index.jade')
    .pipe(jade())
    .pipe(gulp.dest('.'))
    .pipe(ftp(ftpSettings));
});

gulp.task('others', function(){
    return gulp.src('*.*')
    .pipe(gulp.dest('dest'))
    .pipe(ftp(ftpSettings));
});
