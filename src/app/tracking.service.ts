import { environment } from '../environments/environment';

const TRACKING_ID = 'UA-118749596-1';
const CONFIG_OBJECT = 'oaseprogram.dk';

export class TrackingService {
  debugMode = !environment.production;

  trackPageView(url = location.pathname) {
    if (this.debugMode) {
      console.log('TRACK', url);
      return;
    }
    window['ga']('send', 'pageview', url);
  }

  constructor() {
    if (!this.debugMode) {
      /* tslint:disable-next-line */
      (function (i, s, o, g, r) { i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () { (i[r].q = i[r].q || []).push(arguments) }, i[r].l = (new Date()).getTime(); var a = s.createElement(o), m = s.getElementsByTagName(o)[0]; a['async'] = 1; a['src'] = g; m.parentNode.insertBefore(a, m) })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga'); // jshint ignore:line
      window['ga']('create', TRACKING_ID, CONFIG_OBJECT);
    }
  }
}
