export type LibraryCategoryT =
  | 'Framework'
  | 'StateManagement'
  | 'Components'
  | 'Testing';

export interface AppConfigT {
  name: string; // the same as npm name. Used in url (in compare parameter)
  selected: boolean;
  category: LibraryCategoryT;
  github: {
    name: string;
    owner: string;
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

const appsConfigs: AppConfigT[] = [
  {
    name: 'vue',
    selected: true,
    category: 'Framework',
    github: { name: 'vue', owner: 'vuejs' },
  },

  {
    name: 'react',
    selected: true,
    category: 'Framework',
    github: { name: 'react', owner: 'facebook' },
  },

  {
    name: 'svelte',
    selected: true,
    category: 'Framework',
    github: { name: 'svelte', owner: 'sveltejs' },
  },

  {
    name: '@angular/core',
    selected: false,
    category: 'Framework',
    github: { name: 'angular', owner: 'angular' },
  },

  {
    name: 'ember-source',
    selected: false,
    category: 'Framework',
    github: { name: 'ember.js', owner: 'emberjs' },
  },

  {
    name: 'redux',
    selected: false,
    category: 'StateManagement',
    github: { name: 'redux', owner: 'reduxjs' },
  },

  {
    name: 'recoil',
    selected: false,
    category: 'StateManagement',
    github: { name: 'Recoil', owner: 'facebookexperimental' },
  },

  {
    name: 'xstate',
    selected: false,
    category: 'StateManagement',
    github: { name: 'xstate', owner: 'davidkpiano' },
  },

  {
    name: '@testing-library/react',
    selected: false,
    category: 'Testing',
    github: { name: 'react-testing-library', owner: 'testing-library' },
  },

  {
    name: 'enzyme',
    selected: false,
    category: 'Testing',
    github: { name: 'enzyme', owner: 'enzymejs' },
  },

  {
    name: 'vuetify',
    selected: false,
    category: 'Components',
    github: { name: 'vuetify', owner: 'vuetifyjs' },
  },

  {
    name: 'quasar',
    selected: false,
    category: 'Components',
    github: { name: 'quasar', owner: 'quasarframework' },
  },

  {
    name: 'bootstrap-vue',
    selected: false,
    category: 'Components',
    github: { name: 'bootstrap-vue', owner: 'bootstrap-vue' },
  },

  {
    name: 'element-ui',
    selected: false,
    category: 'Components',
    github: { name: 'element', owner: 'elemefe' },
  },
];

export default appsConfigs;

export const appsConfigsMap = appsConfigs.reduce((accum, config) => {
  accum[config.name] = config;
  return accum;
}, {} as { [key: string]: AppConfigT });
