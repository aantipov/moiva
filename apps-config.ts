type TRadarLevel = 'Hold' | 'Adopt' | 'Trial' | 'Assess' | 'No Data';

export interface AppConfigT {
  name: string;
  github: {
    name: string;
    owner: string;
  };
  npm: {
    backgroundColor: string;
    borderColor: string;
  };
  tradar: {
    backgroundColor: string;
    borderColor: string;
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
    name: 'vue',
    github: { name: 'vue', owner: 'vuejs' },
    npm: {
      backgroundColor: COLOR_GREEN_VUE,
      borderColor: COLOR_GREEN_VUE,
    },
    tradar: {
      backgroundColor: COLOR_GREEN_VUE,
      borderColor: COLOR_GREEN_VUE,
      data: {
        '2016-11': ASSESS,
        '2017-03': TRIAL,
        '2020-05': ADOPT,
      },
    },
  },
  {
    name: 'react',
    github: { name: 'react', owner: 'facebook' },
    npm: {
      backgroundColor: COLOR_BLUE_REACT,
      borderColor: COLOR_BLUE_REACT,
    },
    tradar: {
      backgroundColor: COLOR_BLUE_REACT,
      borderColor: COLOR_BLUE_REACT,
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
    github: { name: 'svelte', owner: 'sveltejs' },
    npm: {
      backgroundColor: COLOR_ORANGE_SVELTE,
      borderColor: COLOR_ORANGE_SVELTE,
    },
    tradar: {
      backgroundColor: COLOR_ORANGE_SVELTE,
      borderColor: COLOR_ORANGE_SVELTE,
      data: {
        '2020-10': ASSESS,
      },
    },
  },
] as AppConfigT[];

export default appsConfigs;

export const appsConfigsMap = appsConfigs.reduce((accum, config) => {
  accum[config.name] = config;
  return accum;
}, {} as { [key: string]: AppConfigT });
