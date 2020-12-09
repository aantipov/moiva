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
  name: string;
  urlname: string;
  color: string;
  selected: boolean;
  category: LibraryCategoryT;
  github: {
    name: string;
    owner: string;
  };
  npm: {
    name: string;
  };
  gTrend: {
    keyword: string;
  } | null;
  tradar: null | TechRadarT;
  bphobia: {
    name: string;
  };
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
    name: 'Vue.js',
    urlname: 'vue',
    color: COLOR_GREEN_VUE,
    selected: true,
    category: 'Framework',
    github: { name: 'vue', owner: 'vuejs' },
    npm: { name: 'vue' },
    gTrend: { keyword: '/g/11c0vmgx5d' }, // Vue.js; type: Topic
    tradar: {
      data: {
        '2016-11': ASSESS,
        '2017-03': TRIAL,
        '2020-05': ADOPT,
      },
    },
    bphobia: { name: 'vue' },
  },

  {
    name: 'React',
    urlname: 'react',
    color: COLOR_BLUE_REACT,
    selected: true,
    category: 'Framework',
    github: { name: 'react', owner: 'facebook' },
    npm: { name: 'react' },
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
    bphobia: { name: 'react' },
  },

  {
    name: 'Svelte',
    urlname: 'svelte',
    color: COLOR_ORANGE_SVELTE,
    selected: true,
    category: 'Framework',
    github: { name: 'svelte', owner: 'sveltejs' },
    npm: { name: 'svelte' },
    gTrend: { keyword: 'Svelte' },
    tradar: {
      data: {
        '2020-10': ASSESS,
      },
    },
    bphobia: { name: 'svelte' },
  },

  {
    name: 'Angular',
    urlname: 'angular',
    color: COLOR_RED_ANGULAR,
    selected: false,
    category: 'Framework',
    github: { name: 'angular', owner: 'angular' },
    npm: { name: '@angular/core' },
    gTrend: { keyword: '/g/11c6w0ddw9' }, // Angular; type: Web framework
    tradar: {
      data: {
        '2017-03': ASSESS,
        '2017-11': TRIAL,
      },
    },
    bphobia: { name: 'angular' },
  },

  {
    name: 'Ember.js',
    urlname: 'emberjs',
    color: COLOR_YELLOW,
    selected: false,
    category: 'Framework',
    github: { name: 'ember.js', owner: 'emberjs' },
    npm: { name: 'ember-source' },
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
    bphobia: { name: 'ember-source' },
  },

  {
    name: 'Redux',
    urlname: 'redux',
    color: COLOR_PURPLE,
    selected: false,
    category: 'StateManagement',
    github: { name: 'redux', owner: 'reduxjs' },
    npm: { name: 'redux' },
    gTrend: { keyword: '/g/11dxf0gf92' }, // Redux; type: JavaScript library
    tradar: {
      data: {
        '2016-04': TRIAL,
        '2016-11': ADOPT,
        '2017-03': ADOPT,
        '2020-10': TRIAL,
      },
    },
    bphobia: { name: 'redux' },
  },

  {
    name: 'Recoil',
    urlname: 'recoil',
    color: COLOR_BROWN,
    selected: false,
    category: 'StateManagement',
    github: { name: 'Recoil', owner: 'facebookexperimental' },
    npm: { name: 'recoil' },
    gTrend: { keyword: '/m/01dyp7' }, // Recoil; type: Topic
    tradar: {
      data: {
        '2020-10': ASSESS,
      },
    },
    bphobia: { name: 'recoil' },
  },

  {
    name: 'XState',
    urlname: 'xstate',
    color: COLOR_BLACK,
    selected: false,
    category: 'StateManagement',
    github: { name: 'xstate', owner: 'davidkpiano' },
    npm: { name: 'xstate' },
    gTrend: { keyword: 'xstate' },
    tradar: {
      data: {
        '2020-05': ASSESS,
        '2020-10': TRIAL,
      },
    },
    bphobia: { name: 'xstate' },
  },

  {
    name: 'React Testing Library',
    urlname: 'react-testing-library',
    color: COLOR_REACT_TESTIING,
    selected: false,
    category: 'Testing',
    github: { name: 'react-testing-library', owner: 'testing-library' },
    npm: { name: '@testing-library/react' },
    gTrend: { keyword: 'react testing library' },
    tradar: {
      data: {
        '2019-04': ASSESS,
        '2019-11': TRIAL,
        '2020-05': ADOPT,
      },
    },
    bphobia: { name: '@testing-library/react' },
  },

  {
    name: 'Enzyme',
    urlname: 'enzyme',
    color: COLOR_ENZYME,
    selected: false,
    category: 'Testing',
    github: { name: 'enzyme', owner: 'enzymejs' },
    npm: { name: 'enzyme' },
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
    bphobia: { name: 'enzyme' },
  },
  {
    name: 'Vuetify',
    urlname: 'vuetify',
    color: COLOR_BLUE_VUETIFY,
    selected: false,
    category: 'Components',
    github: { name: 'vuetify', owner: 'vuetifyjs' },
    npm: { name: 'vuetify' },
    gTrend: { keyword: 'vuetify' },
    tradar: null,
    bphobia: { name: 'vuetify' },
  },
];

export default appsConfigs;

export const appsConfigsMap = appsConfigs.reduce((accum, config) => {
  accum[config.name] = config;
  return accum;
}, {} as { [key: string]: AppConfigT });
