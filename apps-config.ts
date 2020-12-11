type TRadarLevelT = 'Hold' | 'Adopt' | 'Trial' | 'Assess';
export type LibraryCategoryT =
  | 'Framework'
  | 'StateManagement'
  | 'Components'
  | 'Testing';

export interface TechRadarT {
  data: Partial<Record<string, TRadarLevelT>>;
}

export interface AppConfigT {
  name: string; // the same as npm name. Used in url (in compare parameter)
  selected: boolean;
  category: LibraryCategoryT;
  github: {
    name: string;
    owner: string;
  };
  gTrend: {
    keyword: string;
  } | null;
  tradar: null | TechRadarT;
}

export const categoryMap: Record<LibraryCategoryT, string> = {
  Framework: '# Frameworks',
  Components: '# Component Libraries',
  StateManagement: '# State Management',
  Testing: '# Testing',
};

export const numbersFormatter = new Intl.NumberFormat('en-US', {
  // @ts-ignore
  notation: 'compact',
});

const HOLD: TRadarLevelT = 'Hold';
const ADOPT: TRadarLevelT = 'Adopt';
const TRIAL: TRadarLevelT = 'Trial';
const ASSESS: TRadarLevelT = 'Assess';

export const TRADAR_LEVELS: TRadarLevelT[] = [
  'Assess',
  'Trial',
  'Adopt',
  'Hold',
];

const appsConfigs: AppConfigT[] = [
  {
    name: 'vue',
    selected: true,
    category: 'Framework',
    github: { name: 'vue', owner: 'vuejs' },
    gTrend: { keyword: '/g/11c0vmgx5d' }, // Vue.js; type: Topic
    tradar: {
      data: {
        '2016-11': ASSESS,
        '2017-03': TRIAL,
        '2020-05': ADOPT,
      },
    },
  },

  {
    name: 'react',
    selected: true,
    category: 'Framework',
    github: { name: 'react', owner: 'facebook' },
    gTrend: { keyword: '/m/012l1vxv' }, // React; type: Topic
    tradar: {
      data: {
        '2015-01': ASSESS,
        '2015-05': TRIAL,
        '2015-11': TRIAL,
        '2016-04': ADOPT,
        '2016-11': ADOPT,
      },
    },
  },

  {
    name: 'svelte',
    selected: true,
    category: 'Framework',
    github: { name: 'svelte', owner: 'sveltejs' },
    gTrend: { keyword: 'Svelte' },
    tradar: {
      data: {
        '2020-10': ASSESS,
      },
    },
  },

  {
    name: '@angular/core',
    selected: false,
    category: 'Framework',
    github: { name: 'angular', owner: 'angular' },
    gTrend: { keyword: '/g/11c6w0ddw9' }, // Angular; type: Web framework
    tradar: {
      data: {
        '2017-03': ASSESS,
        '2017-11': TRIAL,
      },
    },
  },

  {
    name: 'ember-source',
    selected: false,
    category: 'Framework',
    github: { name: 'ember.js', owner: 'emberjs' },
    gTrend: { keyword: '/m/0s8wr70' }, // Ember.js; type: Topic
    tradar: {
      data: {
        '2015-05': ASSESS,
        '2015-11': ASSESS,
        '2016-04': TRIAL,
        '2016-11': ADOPT,
        '2017-03': ADOPT,
      },
    },
  },

  {
    name: 'redux',
    selected: false,
    category: 'StateManagement',
    github: { name: 'redux', owner: 'reduxjs' },
    gTrend: { keyword: '/g/11dxf0gf92' }, // Redux; type: JavaScript library
    tradar: {
      data: {
        '2016-04': TRIAL,
        '2016-11': ADOPT,
        '2017-03': ADOPT,
        '2020-10': TRIAL,
      },
    },
  },

  {
    name: 'recoil',
    selected: false,
    category: 'StateManagement',
    github: { name: 'Recoil', owner: 'facebookexperimental' },
    gTrend: { keyword: '/m/01dyp7' }, // Recoil; type: Topic
    tradar: {
      data: {
        '2020-10': ASSESS,
      },
    },
  },

  {
    name: 'xstate',
    selected: false,
    category: 'StateManagement',
    github: { name: 'xstate', owner: 'davidkpiano' },
    gTrend: { keyword: 'xstate' },
    tradar: {
      data: {
        '2020-05': ASSESS,
        '2020-10': TRIAL,
      },
    },
  },

  {
    name: '@testing-library/react',
    selected: false,
    category: 'Testing',
    github: { name: 'react-testing-library', owner: 'testing-library' },
    gTrend: { keyword: 'react testing library' },
    tradar: {
      data: {
        '2019-04': ASSESS,
        '2019-11': TRIAL,
        '2020-05': ADOPT,
      },
    },
  },

  {
    name: 'enzyme',
    selected: false,
    category: 'Testing',
    github: { name: 'enzyme', owner: 'enzymejs' },
    gTrend: { keyword: '/m/02jgw' }, // Enzyme; type: Topic
    tradar: {
      data: {
        '2016-11': TRIAL,
        '2017-03': TRIAL,
        '2018-05': ADOPT,
        '2019-11': HOLD,
        '2020-05': HOLD,
      },
    },
  },

  {
    name: 'vuetify',
    selected: false,
    category: 'Components',
    github: { name: 'vuetify', owner: 'vuetifyjs' },
    gTrend: { keyword: 'vuetify' },
    tradar: null,
  },

  {
    name: 'quasar',
    selected: false,
    category: 'Components',
    github: { name: 'quasar', owner: 'quasarframework' },
    gTrend: { keyword: 'quasar framework' },
    tradar: null,
  },

  {
    name: 'bootstrap-vue',
    selected: false,
    category: 'Components',
    github: { name: 'bootstrap-vue', owner: 'bootstrap-vue' },
    gTrend: { keyword: 'bootstrap-vue' },
    tradar: null,
  },

  {
    name: 'element-ui',
    selected: false,
    category: 'Components',
    github: { name: 'element', owner: 'elemefe' },
    gTrend: { keyword: 'element vue' },
    tradar: null,
  },
];

export default appsConfigs;

export const appsConfigsMap = appsConfigs.reduce((accum, config) => {
  accum[config.name] = config;
  return accum;
}, {} as { [key: string]: AppConfigT });
