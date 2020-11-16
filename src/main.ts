import Vue from 'vue';
import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';
import { Integrations } from '@sentry/tracing';
import App from './App.vue';
import './assets/tailwind.css';

Sentry.init({
  dsn:
    'https://185bd9a836b146318babbd956881e8a0@o477177.ingest.sentry.io/5517696',
  integrations: [
    new VueIntegration({
      Vue,
      tracing: true,
      logErrors: true,
    }),
    new Integrations.BrowserTracing(),
  ],
  // process.env.NODE_ENV is being replaced by the value during build
  environment: process.env.NODE_ENV,
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
