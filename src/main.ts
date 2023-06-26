import { DirectiveBinding } from 'vue';
import type { App } from 'vue';
import tippy from 'tippy.js';
// import * as Sentry from '@sentry/vue';
// TODO: SENTRY
// import { Integrations } from '@sentry/tracing';
import { VueQueryPlugin } from 'vue-query';
// import CatalogApp from './CatalogApp.vue';
// import AboutApp from './AboutApp.vue';
import Close from '@/icons/CloseIcon.vue';
import StarIcon from '@/icons/StarIcon.vue';
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
import SortIcon from '@/icons/SortIcon.vue';

export default (app: App) => {
  if (process.env.NODE_ENV !== 'development') {
    // Sentry.init({
    //   app,
    //   dsn: 'https://185bd9a836b146318babbd956881e8a0@o477177.ingest.sentry.io/5517696',
    //   logErrors: true,
    //   integrations: [
    //     new Integrations.BrowserTracing({
    //       tracingOrigins: ['localhost', 'moiva.io', /^\//],
    //     }),
    //   ],
    //   // process.env.NODE_ENV is being replaced by the value during build
    //   environment: process.env.NODE_ENV,
    //   // We recommend adjusting this value in production, or using tracesSampler
    //   // for finer control
    //   tracesSampleRate: 1.0,
    // });
  }

  app.use(VueQueryPlugin);

  // Table metrics icons
  app
    .component('MStatusIcon', HeartBeatIcon)
    .component('MStarsIcon', StarIcon)
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
    .component('MTsIcon', TSIcon)
    .component('MSortIcon', SortIcon);

  app
    .component('MClose', Close)
    .component('MDotsIcon', DotsIcon)
    .component('MStarIcon', StarIcon)
    .component('MNpmIcon', NpmIcon)
    .component('MChartIcon', ChartIcon)
    .component('MGithubIcon', GithubIcon)
    .component('MDownloadIcon', DownloadIcon);

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
      delay: 700,
      interactive: 'ni' in binding.modifiers ? !binding.modifiers.ni : true, // non-interactive
      allowHTML: binding.modifiers.html,
      appendTo: document.body,
    });
  }

  // TODO: remove this: appCatalog and appAbout are not used anymore
  // const appCatalog = new URL(window.location.href).searchParams.get('appcatalog');
  // const appAbout = new URL(window.location.href).searchParams.get('appabout');

  // if (appCatalog) {
  //   createApp(CatalogApp).mount('#app');
  // } else if (appAbout) {
  //   createApp(AboutApp).mount('#app');
  // } else {
  //   app.mount('#app');
  // }
};
