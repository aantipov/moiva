import { createApp, DirectiveBinding } from 'vue';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/dist/backdrop.css';
import 'tippy.js/dist/svg-arrow.css';
import 'tippy.js/themes/light.css';
import 'tippy.js/themes/light-border.css';
import 'tippy.js/animations/shift-away.css';
import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';
import '../chartjs.config';
import App from './App.vue';
import CatalogApp from './CatalogApp.vue';
import AboutApp from './AboutApp.vue';
import Close from '@/icons/CloseIcon.vue';
import StarIcon from '@/icons/StarIcon.vue';
import HomeIcon from '@/icons/HomeIcon.vue';
import DotsIcon from '@/icons/DotsIcon.vue';
import NpmIcon from '@/icons/NpmIcon.vue';
import ChartIcon from '@/icons/ChartIcon.vue';
import GithubIcon from '@/icons/GithubIcon.vue';
import DownloadIcon from '@/icons/DownloadIcon.vue';
import TagIcon from '@/icons/TagIcon.vue';
import SearchIcon from '@/icons/SearchIcon.vue';
import WorkerIcon from '@/icons/WorkerIcon.vue';
import OldIcon from '@/icons/OldIcon.vue';
import DocumentIcon from '@/icons/DocumentIcon.vue';
import TSIcon from '@/icons/TSIcon.vue';
import UserGroupIcon from '@/icons/UserGroupIcon.vue';
import CommitsIcon from '@/icons/CommitsIcon.vue';
import TWIcon from '@/icons/ThoughtworksIcon.vue';
import CubeIcon from '@/icons/CubeIcon.vue';
import DependencyIcon from '@/icons/DependencyIcon.vue';
import ShieldIcon from '@/icons/ShieldIcon.vue';
import BugIcon from '@/icons/BugIcon.vue';
import HeartBeatIcon from '@/icons/HeartBeatIcon.vue';
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

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    app,
    dsn: 'https://185bd9a836b146318babbd956881e8a0@o477177.ingest.sentry.io/5517696',
    logErrors: true,
    integrations: [
      new Integrations.BrowserTracing({
        tracingOrigins: ['localhost', 'moiva.io', /^\//],
      }),
    ],
    // process.env.NODE_ENV is being replaced by the value during build
    environment: process.env.NODE_ENV,
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
}

// Table metrics icons
app
  .component('MRepoIcon', GithubIcon)
  .component('MStatusIcon', HeartBeatIcon)
  .component('MStarsIcon', StarIcon)
  .component('MHomeIcon', HomeIcon)
  .component('MDownloadsIcon', DownloadIcon)
  .component('MSearchIcon', SearchIcon)
  .component('MDevusageIcon', UserGroupIcon)
  .component('MTradarIcon', TWIcon)
  .component('MReleasesIcon', TagIcon)
  .component('MCommitsIcon', CommitsIcon)
  .component('MContributorsIcon', WorkerIcon)
  .component('MDependenciesIcon', DependencyIcon)
  .component('MLicenseIcon', DocumentIcon)
  .component('MAgeIcon', OldIcon)
  .component('MVulnerabilityIcon', BugIcon)
  .component('MSecurityIcon', ShieldIcon)
  .component('MBundlesizeIcon', CubeIcon)
  .component('MTsIcon', TSIcon);

app
  .component('MClose', Close)
  .component('MTag', Tag)
  .component('MDotsIcon', DotsIcon)
  .component('MStarIcon', StarIcon)
  .component('MNpmIcon', NpmIcon)
  .component('MChartIcon', ChartIcon)
  .component('MGithubIcon', GithubIcon)
  .component('MDownloadIcon', DownloadIcon)
  .component('MChartInfo', ChartInfo)
  .component('MLoaderTailSpin', LoaderTailSpin)
  .component('MLoader', Loader)
  .component('MLoaderNew', LoaderNew)
  .component('MExtLink', ExternalLink)
  .component('MChart', ChartPresentation)
  .component('MChartMenu', ChartMenu);

app.directive('tooltip', {
  mounted(el, binding) {
    if (binding.value) {
      initTooltip(el, binding);
    }
  },
  updated(el, binding) {
    if (el._tippy) {
      el._tippy.setContent(binding.value);
    } else {
      initTooltip(el, binding);
    }
  },
});

function initTooltip(el: unknown, binding: DirectiveBinding<any>) {
  tippy(el as HTMLElement, {
    content: binding.value,
    delay: 150,
    interactive: 'ni' in binding.modifiers ? !binding.modifiers.ni : true, // non-interactive
    allowHTML: binding.modifiers.html,
    appendTo: document.body,
  });
}

const appCatalog = new URL(window.location.href).searchParams.get('appcatalog');
const appAbout = new URL(window.location.href).searchParams.get('appabout');

if (appCatalog) {
  createApp(CatalogApp).mount('#app');
} else if (appAbout) {
  createApp(AboutApp).mount('#app');
} else {
  app.mount('#app');
}
