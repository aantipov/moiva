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
  color: string;
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

// https://material.io/design/color/the-color-system.html#tools-for-picking-colors
export const COLOR_GREEN = '#48bb78';
export const COLOR_GRAY = '#a0aec0';
export const COLOR_BLUE = '#4299e1';
export const COLOR_PINK = '#ed64a6';
export const COLOR_RED = '#f56565';
export const COLOR_PURPLE = '#9f7aea';
const COLOR_ORANGE_SVELTE = '#ff3e00';
const COLOR_BLUE_REACT = '#3ed6ff';
const COLOR_BLUE_VUETIFY = '#1867C0';
const COLOR_GREEN_VUE = '#42b983';
const COLOR_GREEN_QUASAR = '#00796B';
const COLOR_BLUE_ELEMENT_VUE = '#00B0FF';
const COLOR_PURPLE_BOOTSTRAP_VUE = '#673AB7';
const COLOR_YELLOW = '#FDD835';
const COLOR_BROWN = '#6D4C41';
const COLOR_BLACK = '#000000';
const COLOR_RED_ANGULAR = '#C62828';
const COLOR_REACT_TESTIING = '#5C6BC0'; // Indigo 400
const COLOR_ENZYME = '#D4E157'; // Lime 400

export const TRADAR_LEVELS: TRadarLevelT[] = [
  'Assess',
  'Trial',
  'Adopt',
  'Hold',
];

const appsConfigs: AppConfigT[] = [
  {
    name: 'vue',
    color: COLOR_GREEN_VUE,
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
    color: COLOR_BLUE_REACT,
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
    color: COLOR_ORANGE_SVELTE,
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
    color: COLOR_RED_ANGULAR,
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
    color: COLOR_YELLOW,
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
    color: COLOR_PURPLE,
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
    color: COLOR_BROWN,
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
    color: COLOR_BLACK,
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
    color: COLOR_REACT_TESTIING,
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
    color: COLOR_ENZYME,
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
    color: COLOR_BLUE_VUETIFY,
    selected: false,
    category: 'Components',
    github: { name: 'vuetify', owner: 'vuetifyjs' },
    gTrend: { keyword: 'vuetify' },
    tradar: null,
  },

  {
    name: 'quasar',
    color: COLOR_GREEN_QUASAR,
    selected: false,
    category: 'Components',
    github: { name: 'quasar', owner: 'quasarframework' },
    gTrend: { keyword: 'quasar framework' },
    tradar: null,
  },

  {
    name: 'bootstrap-vue',
    color: COLOR_PURPLE_BOOTSTRAP_VUE,
    selected: false,
    category: 'Components',
    github: { name: 'bootstrap-vue', owner: 'bootstrap-vue' },
    gTrend: { keyword: 'bootstrap-vue' },
    tradar: null,
  },

  {
    name: 'element-ui',
    color: COLOR_BLUE_ELEMENT_VUE,
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
