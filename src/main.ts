import Vue from 'vue';
import Chart from 'chart.js';
import 'chartjs-adapter-date-fns';
// import * as Sentry from '@sentry/browser';
// import { Vue as VueIntegration } from '@sentry/integrations';
// import { Integrations } from '@sentry/tracing';
import App from './App.vue';
import Close from './components/icons/Close.vue';
import Chip from './components/Chip.vue';
import ArrowDown from './components/icons/ArrowDown.vue';
import './assets/tailwind.css';

// Sentry.init({
//   dsn:
//     'https://185bd9a836b146318babbd956881e8a0@o477177.ingest.sentry.io/5517696',
//   integrations: [
//     new VueIntegration({
//       Vue,
//       tracing: true,
//       logErrors: true,
//     }),
//     new Integrations.BrowserTracing(),
//   ],
//   // process.env.NODE_ENV is being replaced by the value during build
//   environment: process.env.NODE_ENV,
//   // We recommend adjusting this value in production, or using tracesSampler
//   // for finer control
//   tracesSampleRate: 1.0,
// });

Vue.config.productionTip = false;

Chart.defaults.global.defaultFontSize = 14;
Chart.defaults.global.defaultFontFamily =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
// @ts-ignore
Chart.defaults.global.title.padding = 0;
// @ts-ignore
Chart.defaults.global.title.fontSize = 14;
// @ts-ignore
Chart.defaults.global.title.fontFamily =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
// @ts-ignore
Chart.defaults.global.legend.labels.boxWidth = 20;
Chart.defaults.global.maintainAspectRatio = false;
Chart.defaults.global.tooltips = {
  ...Chart.defaults.global.tooltips,
  mode: 'index',
  bodySpacing: 6,
  bodyFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
  position: 'nearest',
  intersect: false,
  callbacks: {
    ...Chart.defaults.global.tooltips.callbacks,
    label(tooltipItem, data): string {
      // @ts-ignore
      const label = data.datasets[tooltipItem.datasetIndex].label;

      // @ts-ignore
      return ` ${label}: ${Number(tooltipItem.yLabel).toLocaleString()}`;
    },
  },
};

Vue.component('jd-arrow-down', ArrowDown);
Vue.component('jd-close', Close);
Vue.component('jd-chip', Chip);

new Vue({
  // eslint-disable-next-line
  render: (h) => h(App),
}).$mount('#app');
