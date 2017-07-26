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

target['setup'] = function() {
  rm('-rf', 'dist');
  mkdir('-p', 'dist');
};

target['copy'] = function() {
  cp('-r', 'assets', 'dist');
  cp('-r', 'views/layout.html', 'dist');
  mv('dist/layout.html', 'dist/index.html');
}

target['build'] = function () {
  target['setup']();
  target['stylesheets:build'](false);
  target['copy']();
};
