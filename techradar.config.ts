const HOLD = 'Hold';
const ADOPT = 'Adopt';
const TRIAL = 'Trial';
const ASSESS = 'Assess';

type TRadarLevelT = typeof HOLD | typeof ADOPT | typeof TRIAL | typeof ASSESS;

export const TRADAR_LEVELS: TRadarLevelT[] = [ASSESS, TRIAL, ADOPT, HOLD];

const libs: { name: string; data: { [key: string]: TRadarLevelT } }[] = [
  {
    name: 'vue',
    data: {
      '2016-11': ASSESS,
      '2017-03': TRIAL,
      '2020-05': ADOPT,
    },
  },
  {
    name: 'react',
    data: {
      '2015-01': ASSESS,
      '2015-05': TRIAL,
      '2015-11': TRIAL,
      '2016-04': ADOPT,
      '2016-11': ADOPT,
    },
  },
  {
    name: 'svelte',
    data: {
      '2020-10': ASSESS,
    },
  },
  {
    name: '@angular/core',
    data: {
      '2017-03': ASSESS,
      '2017-11': TRIAL,
    },
  },
  {
    name: 'ember-source',
    data: {
      '2015-05': ASSESS,
      '2015-11': ASSESS,
      '2016-04': TRIAL,
      '2016-11': ADOPT,
      '2017-03': ADOPT,
    },
  },
  {
    name: 'redux',
    data: {
      '2016-04': TRIAL,
      '2016-11': ADOPT,
      '2017-03': ADOPT,
      '2020-10': TRIAL,
    },
  },
  {
    name: 'recoil',
    data: {
      '2020-10': ASSESS,
    },
  },
  {
    name: 'xstate',
    data: {
      '2020-05': ASSESS,
      '2020-10': TRIAL,
    },
  },
  {
    name: '@testing-library/react',
    data: {
      '2019-04': ASSESS,
      '2019-11': TRIAL,
      '2020-05': ADOPT,
    },
  },
  {
    name: 'enzyme',
    data: {
      '2016-11': TRIAL,
      '2017-03': TRIAL,
      '2018-05': ADOPT,
      '2019-11': HOLD,
      '2020-05': HOLD,
    },
  },
];

export const libsToDatadMap = libs.reduce((accum, lib) => {
  accum[lib.name] = lib.data;
  return accum;
}, {} as Record<string, Record<string, TRadarLevelT>>);
