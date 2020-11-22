type TRadarLevelT = 'Hold' | 'Adopt' | 'Trial' | 'Assess';
export type LibraryCategoryT = 'Framework' | 'StateManagement' | 'Testing';

export interface AppConfigT {
  name: string;
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
  tradar: {
    data: Partial<Record<string, TRadarLevelT>>;
  };
}

export const categoryMap: Record<LibraryCategoryT, string> = {
  Framework: '# Frameworks',
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
    color: COLOR_GREEN_VUE,
    selected: true,
    category: 'Framework',
    github: { name: 'vue', owner: 'vuejs' },
    npm: { name: 'vue' },
    tradar: {
      data: {
        '2016-11': ASSESS,
        '2017-03': TRIAL,
        '2020-05': ADOPT,
      },
    },
  },
  {
    name: 'React',
    color: COLOR_BLUE_REACT,
    selected: true,
    category: 'Framework',
    github: { name: 'react', owner: 'facebook' },
    npm: { name: 'react' },
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
    name: 'Svelte',
    color: COLOR_ORANGE_SVELTE,
    selected: true,
    category: 'Framework',
    github: { name: 'svelte', owner: 'sveltejs' },
    npm: { name: 'svelte' },
    tradar: {
      data: {
        '2020-10': ASSESS,
      },
    },
  },
  {
    name: 'Angular',
    color: COLOR_RED_ANGULAR,
    selected: false,
    category: 'Framework',
    github: { name: 'angular', owner: 'angular' },
    npm: { name: '@angular/core' },
    tradar: {
      data: {
        '2017-03': ASSESS,
        '2017-11': TRIAL,
      },
    },
  },
  {
    name: 'Ember.js',
    color: COLOR_YELLOW,
    selected: false,
    category: 'Framework',
    github: { name: 'ember.js', owner: 'emberjs' },
    npm: { name: 'ember-source' },
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
    name: 'Redux',
    color: COLOR_PURPLE,
    selected: false,
    category: 'StateManagement',
    github: { name: 'redux', owner: 'reduxjs' },
    npm: { name: 'redux' },
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
    name: 'Recoil',
    color: COLOR_BROWN,
    selected: false,
    category: 'StateManagement',
    github: { name: 'Recoil', owner: 'facebookexperimental' },
    npm: { name: 'recoil' },
    tradar: {
      data: {
        '2020-10': ASSESS,
      },
    },
  },
  {
    name: 'XState',
    color: COLOR_BLACK,
    selected: false,
    category: 'StateManagement',
    github: { name: 'xstate', owner: 'davidkpiano' },
    npm: { name: 'xstate' },
    tradar: {
      data: {
        '2020-05': ASSESS,
        '2020-10': TRIAL,
      },
    },
  },
  {
    name: 'React Testing Library',
    color: COLOR_REACT_TESTIING,
    selected: false,
    category: 'Testing',
    github: { name: 'react-testing-library', owner: 'testing-library' },
    npm: { name: '@testing-library/react' },
    tradar: {
      data: {
        '2019-04': ASSESS,
        '2019-11': TRIAL,
        '2020-05': ADOPT,
      },
    },
  },
  {
    name: 'Enzyme',
    color: COLOR_ENZYME,
    selected: false,
    category: 'Testing',
    github: { name: 'enzyme', owner: 'enzymejs' },
    npm: { name: 'enzyme' },
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
];

export default appsConfigs;

export const appsConfigsMap = appsConfigs.reduce((accum, config) => {
  accum[config.name] = config;
  return accum;
}, {} as { [key: string]: AppConfigT });
