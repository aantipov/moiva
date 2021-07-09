import { createApp } from 'vue';
import tippy from 'tippy.js';
import * as Sentry from '@sentry/browser';
import '../chartjs.config';
// import { Vue as VueIntegration } from '@sentry/integrations';
import { Integrations } from '@sentry/tracing';
import App from './App.vue';
import CatalogApp from './CatalogApp.vue';
import Close from './components/icons/Close.vue';
import ChartInfo from '@/components/ChartInfo.vue';
import ChartPresentation from '@/components/ChartPresentation.vue';
import LoaderTailSpin from '@/components/LoaderTailSpin.vue';
import ExternalLink from '@/components/ExternalLink.vue';
import Loader from '@/components/Loader.vue';
import LoaderNew from '@/components/LoaderNew.vue';
import './assets/tailwind.css';

const app = createApp(App);

app.component('MClose', Close);
app.component('MChartInfo', ChartInfo);
app.component('MLoaderTailSpin', LoaderTailSpin);
app.component('MLoader', Loader);
app.component('MLoaderNew', LoaderNew);
app.component('MExtLink', ExternalLink);
app.component('MChart', ChartPresentation);
app.directive('tooltip', (el, binding) => {
  tippy(el as HTMLElement, {
    content: binding.value,
    delay: 150,
    interactive: 'ni' in binding.modifiers ? !binding.modifiers.ni : true, // non-interactive
    allowHTML: binding.modifiers.html,
    appendTo: document.body,
  });
});

const appCatalog = new URL(window.location.href).searchParams.get('appcatalog');

if (appCatalog) {
  const catalogApp = createApp(CatalogApp);
  catalogApp.mount('#app');
} else {
  app.mount('#app');
}

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: 'https://185bd9a836b146318babbd956881e8a0@o477177.ingest.sentry.io/5517696',
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
