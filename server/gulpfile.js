const gulp = require('gulp');
const apidoc = require('gulp-apidoc');

gulp.task('doc', async () =>
  apidoc(
    {
      src: 'routes/',
      dest: 'public/apidoc/',
      debug: false,
      includeFilters: ['.*\\.js$']
    },
    () => {}
  )
);
