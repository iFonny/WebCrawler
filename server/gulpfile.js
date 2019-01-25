const gulp = require('gulp');
const spawn = require('child_process').spawn;
const apidoc = require('gulp-apidoc');

gulp.task('apidoc', async () =>
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

gulp.task('start', cb => {
  spawn('node', ['index.js'], {
    env: { ...process.env, NODE_ENV: 'production' },
    stdio: 'inherit'
  });
});

gulp.task('default', gulp.parallel('apidoc', 'start'));
