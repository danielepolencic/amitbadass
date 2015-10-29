require('shelljs/make');
var fs = require('fs');

var CleanCSS = require('clean-css');
var watch = fs.watch;

target['stylesheets:build'] = stylesheetsBuild;

function stylesheetsBuild (isDevelopment) {
  var css = new CleanCSS({
    sourceMap: !!isDevelopment,
    processImport: true,
    relativeTo: __dirname + '/assets/stylesheets/'
  }).minify(cat(['assets/stylesheets/style.css'].concat(
    (!!isDevelopment) ? 'assets/stylesheets/responsive-debug.css' : []
  )));

  css.styles.to('assets/bundle.css');
  if (css.sourceMap) {
    var map = new Buffer(JSON.stringify(css.sourceMap)).toString('base64');
    ('\n/*# sourceMappingURL=data:application/json;base64,' + map + '*/\n')
      .toEnd('assets/bundle.css');
  }
};

target['stylesheets:watch'] = function () {
  watch('assets/stylesheets/', function (event, filename) {
    console.log('[css:watch]');
    stylesheetsBuild.call(null, true);
  });

  target['stylesheets:build'](true);
};


var browserify = require('browserify');
var watchify = require('watchify');

target['scripts:build'] = function () {
  browserify({
    entries: ['./assets/scripts/main.js'],
    debug: false
  })
  .require('./assets/scripts/ga.js', {expose: 'ga'})
  .transform({sourcemap: false, global: true}, 'uglifyify')
  .bundle()
  .pipe(fs.createWriteStream('assets/bundle.js'));
};

target['scripts:watch'] = function () {
  var bundle = browserify({
    entries: ['./assets/scripts/main.js'],
    debug: true,
    cache: {},
    packageCache: {}
  });

  var js = watchify(bundle)
  .on('update', function () {
    console.info('[js:watch]');
    js.bundle().pipe(fs.createWriteStream('assets/bundle.js'));
  });

  bundle.require('./assets/scripts/ga.js', {expose: 'ga'});

  js.bundle()
  .pipe(fs.createWriteStream('assets/bundle.js'));
};


var nodemon = require('nodemon');

target['server:watch'] = function () {
  nodemon({
    script: 'index.js',
    ext: 'js json'
  })
  .on('restart', function () {
    console.log('Server restarted');
  });
};

target['server:run'] = function () {
  exec('node index.js');
};
