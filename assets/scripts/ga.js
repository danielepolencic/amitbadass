module.exports = function (gaId) {
  if (!gaId) {
    window['ga'] = function() {};
    var log = (typeof console !== 'undefined') ? console.log.bind(console) : function () {};
    return log('Google Analytics is deactivated.');
  }

  window['GoogleAnalyticsObject'] = 'ga';
  window['ga'] = window['ga'] || function() {
    (window['ga'].q = window['ga'].q || []).push(arguments);
  };

  window['ga'].l = 1 * new Date();

  var script = document.createElement('script');
  var scriptTag = document.getElementsByTagName('script')[0];
  script.async = 1;
  script.src = '//www.google-analytics.com/analytics.js';
  scriptTag.parentNode.insertBefore(script, scriptTag);

  ga('create', gaId, 'auto');
  ga('send', 'pageview');
};
