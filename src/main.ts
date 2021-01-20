import { createApp } from 'vue';
import Chart from 'chart.js';
import 'chartjs-adapter-date-fns';
import * as Sentry from '@sentry/browser';
// import { Vue as VueIntegration } from '@sentry/integrations';
import { Integrations } from '@sentry/tracing';
import { updateTitle, setNoFollowTag } from './utils';
import App from './App.vue';
import Close from './components/icons/Close.vue';
import ChartInfo from '@/components/ChartInfo.vue';
import ChartPresentation from '@/components/ChartPresentation.vue';
import LoaderTailSpin from '@/components/LoaderTailSpin.vue';
import Loader from '@/components/Loader.vue';
import './assets/tailwind.css';

// Make Document title SEO friendly
updateTitle();

// Do not allow Google index pages with >3 libraries in comparison
setNoFollowTag();

Chart.defaults.global.defaultFontSize = 14;
Chart.defaults.global.defaultFontFamily =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
(Chart.defaults.global.title as Chart.ChartTitleOptions) = {
  ...Chart.defaults.global.title,
  padding: 0,
  fontSize: 14,
  fontFamily:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
};
// @ts-ignore
Chart.defaults.global.legend.labels.boxWidth = 20;
Chart.defaults.global.maintainAspectRatio = false;
Chart.defaults.global.elements = {
  ...Chart.defaults.global.elements,
  line: {
    ...Chart.defaults.global.elements?.line,
    fill: false,
    borderWidth: 4,
  },
  point: {
    ...Chart.defaults.global.elements?.point,
    radius: 4,
    hoverRadius: 6,
  },
};
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
      const label = (data.datasets as Chart.ChartDataSets[])[
        tooltipItem.datasetIndex as number
      ].label;

      return ` ${label}: ${Number(tooltipItem.yLabel).toLocaleString()}`;
    },
  },
};

const app = createApp(App);

app.component('MClose', Close);
app.component('MChartInfo', ChartInfo);
app.component('MLoaderTailSpin', LoaderTailSpin);
app.component('MLoader', Loader);
app.component('MChart', ChartPresentation);

app.mount('#app');

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn:
      'https://185bd9a836b146318babbd956881e8a0@o477177.ingest.sentry.io/5517696',
    integrations: [
      // new VueIntegration({
      //   app,
      //   tracing: true,
      //   logErrors: true,
      // }),
      new Integrations.BrowserTracing(),
    ],
    // process.env.NODE_ENV is being replaced by the value during build
    environment: process.env.NODE_ENV,
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
}
