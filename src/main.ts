import { createApp } from 'vue';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/dist/backdrop.css';
import 'tippy.js/dist/svg-arrow.css';
import 'tippy.js/themes/light.css';
import 'tippy.js/themes/light-border.css';
import 'tippy.js/animations/shift-away.css';
import * as Sentry from '@sentry/browser';
import '../chartjs.config';
// import { Vue as VueIntegration } from '@sentry/integrations';
import { Integrations } from '@sentry/tracing';
import App from './App.vue';
import CatalogApp from './CatalogApp.vue';
import AboutApp from './AboutApp.vue';
import Close from '@/components/icons/Close.vue';
import StarIcon from '@/components/icons/Star.vue';
import DotsIcon from '@/icons/Dots.vue';
import NpmIcon from '@/icons/Npm.vue';
import GithubIcon from '@/icons/Github.vue';
import DownloadIcon from '@/components/icons/Download.vue';
import Tag from '@/components/Tag.vue';
import ChartInfo from '@/components/ChartInfo.vue';
import ChartMenu from '@/components/ChartMenu.vue';
import ChartPresentation from '@/components/ChartPresentation.vue';
import LoaderTailSpin from '@/components/LoaderTailSpin.vue';
import ExternalLink from '@/components/ExternalLink.vue';
import Loader from '@/components/Loader.vue';
import LoaderNew from '@/components/LoaderNew.vue';
import './assets/tailwind.css';

const app = createApp(App);

app.component('MClose', Close);
app.component('MTag', Tag);
app.component('MDotsIcon', DotsIcon);
app.component('MStarIcon', StarIcon);
app.component('MNpmIcon', NpmIcon);
app.component('MGithubIcon', GithubIcon);
app.component('MDownloadIcon', DownloadIcon);
app.component('MChartInfo', ChartInfo);
app.component('MLoaderTailSpin', LoaderTailSpin);
app.component('MLoader', Loader);
app.component('MLoaderNew', LoaderNew);
app.component('MExtLink', ExternalLink);
app.component('MChart', ChartPresentation);
app.component('MChartMenu', ChartMenu);
app.directive('tooltip', {
  mounted(el, binding) {
    tippy(el as HTMLElement, {
      content: binding.value,
      delay: 150,
      interactive: 'ni' in binding.modifiers ? !binding.modifiers.ni : true, // non-interactive
      allowHTML: binding.modifiers.html,
      appendTo: document.body,
    });
  },
  updated(el, binding) {
    el._tippy.setContent(binding.value);
  },
});

const appCatalog = new URL(window.location.href).searchParams.get('appcatalog');
const appAbout = new URL(window.location.href).searchParams.get('appabout');

if (appCatalog) {
  createApp(CatalogApp).mount('#app');
} else if (appAbout) {
  createApp(AboutApp).mount('#app');
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
