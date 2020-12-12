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
    tradar: null,
  },

  {
    name: 'quasar',
    selected: false,
    category: 'Components',
    github: { name: 'quasar', owner: 'quasarframework' },
    tradar: null,
  },

  {
    name: 'bootstrap-vue',
    selected: false,
    category: 'Components',
    github: { name: 'bootstrap-vue', owner: 'bootstrap-vue' },
    tradar: null,
  },

  {
    name: 'element-ui',
    selected: false,
    category: 'Components',
    github: { name: 'element', owner: 'elemefe' },
    tradar: null,
  },
];

export default appsConfigs;

export const appsConfigsMap = appsConfigs.reduce((accum, config) => {
  accum[config.name] = config;
  return accum;
}, {} as { [key: string]: AppConfigT });
