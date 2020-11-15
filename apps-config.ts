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
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
    },
    tradar: {
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
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
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
    },
    tradar: {
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      data: {
        '2015-01': ASSESS,
        '2015-05': TRIAL,
        '2015-11': TRIAL,
        '2016-04': ADOPT,
        '2016-11': ADOPT,
      },
    },
  },
] as AppConfigT[];

export default appsConfigs;

export const appsConfigsMap = appsConfigs.reduce((accum, config) => {
  accum[config.name] = config;
  return accum;
}, {} as { [key: string]: AppConfigT });
