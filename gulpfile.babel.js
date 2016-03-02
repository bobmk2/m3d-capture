import gulp from 'gulp';
import babel from 'gulp-babel';
import run from 'gulp-run';

import runSequence from 'run-sequence';

gulp.task('build', () => {
  return gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('lib'));
});

gulp.task('watch', () => {
  gulp.watch('./src/**/*.js', () => {
    runSequence('build');
  });
});