type TRadarLevel = 'Hold' | 'Adopt' | 'Trial' | 'Assess' | 'No Data';

export interface AppConfigT {
  name: string;
  color: string;
  github: {
    name: string;
    owner: string;
  };
  npm: {
    name: string;
  };
  tradar: {
    data: Partial<Record<string, TRadarLevel>>;
  };
}

// const HOLD: TRadarLevel = 'Hold';
const ADOPT = 'Adopt';
const TRIAL = 'Trial';
const ASSESS = 'Assess';
// const NO_DATA = 'No Data';

export const COLOR_GREEN = '#48bb78';
export const COLOR_GRAY = '#a0aec0';
export const COLOR_BLUE = '#4299e1';
export const COLOR_PINK = '#ed64a6';
export const COLOR_RED = '#f56565';
export const COLOR_PURPLE = '#9f7aea';
const COLOR_ORANGE_SVELTE = '#ff3e00';
const COLOR_BLUE_REACT = '#3ed6ff';
const COLOR_GREEN_VUE = '#42b983';

export const TRADAR_LEVELS: TRadarLevel[] = [
  'No Data',
  'Assess',
  'Trial',
  'Adopt',
  'Hold',
];

const appsConfigs: AppConfigT[] = [
  {
    name: 'Vue.js',
    color: COLOR_GREEN_VUE,
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
    github: { name: 'svelte', owner: 'sveltejs' },
    npm: { name: 'svelte' },
    tradar: {
      data: {
        '2020-10': ASSESS,
      },
    },
  },
  {
    name: 'Ember.js',
    color: COLOR_PURPLE,
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
] as AppConfigT[];

export default appsConfigs;

export const appsConfigsMap = appsConfigs.reduce((accum, config) => {
  accum[config.name] = config;
  return accum;
}, {} as { [key: string]: AppConfigT });
