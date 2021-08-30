import { prevQuarter } from '@/utils';

const METRICS = [
  'npm',
  'repo',
  'status',
  'tags',
  'stars',
  'downloads',
  'searchInterest',
  'devusage',
  'releases',
  'commits',
  'contributors',
  'dependencies',
  'bundlesize',
  'ts',
  'tradar',
  'security',
  'vulnerability',
  'age',
  'license',
] as const;

export type MetricT = typeof METRICS[number];

// Metrics which are removed if there are no npm packages
export const NPM_METRICS: MetricT[] = [
  'npm',
  'downloads',
  'releases',
  'dependencies',
  'bundlesize',
  'ts',
  'security',
];

export type CategoryT = '' | 'Popularity' | 'Maintenance' | 'Miscellaneous';

interface CategoryConfigT {
  bgColor: string;
  marginTop: string;
}

export const CAT_CONFIG: Record<CategoryT, CategoryConfigT> = {
  '': { bgColor: '', marginTop: '0px' },
  Popularity: { bgColor: 'bg-green-100', marginTop: '60px' },
  Maintenance: { bgColor: 'bg-yellow-100', marginTop: '77px' },
  Miscellaneous: { bgColor: 'bg-purple-100', marginTop: '87px' },
};

export interface MetricDataT {
  metric: MetricT;
  cat: CategoryT;
  label: string;
  labelSub?: string;
  labelMore?: string;
  tooltip?: string;
  icon?: string;
}

export const ROWS: MetricDataT[] = [
  { cat: '', metric: 'npm', label: 'Npm' },
  { cat: '', metric: 'repo', label: 'GitHub', tooltip: 'GitHub repository' },

  {
    cat: '',
    metric: 'status',
    label: 'Status',
    tooltip:
      '<p>Library status. Possible values:</p><p>- "Active"<br> - "Inactive" if no commits in the last 6 months<br> - "Legacy" if library authors called it so<br> - "Archived" if the repository is archived</p>',
  },

  { metric: 'tags', cat: '', label: 'Tags' },

  {
    cat: 'Popularity',
    metric: 'stars',
    label: 'Stars',
    labelSub: 'in total',
    labelMore: 'and monthly growth',
    tooltip:
      'The total number of GitHub stars and the average number of new stars per month over the last 3 months',
  },

  {
    cat: 'Popularity',
    metric: 'downloads',
    label: 'Npm Downloads',
    labelSub: 'monthly',
    labelMore: 'and monthly growth',
    tooltip:
      'The average number of Npm downloads per month over the last 3 months. The average monthly Npm downloads growth over the last 6 months',
  },

  {
    cat: 'Popularity',
    metric: 'searchInterest',
    label: 'Search Interest, %',
    tooltip:
      'An average Google search interest in relation to other libraries.',
    icon: 'm-search-icon',
  },

  {
    cat: 'Popularity',
    metric: 'devusage',
    label: 'Developer Usage, %',
    tooltip:
      'Percentage of developers using the library according to the latest <a href="https://stateofjs.com/" target="_blank">StateOfJS 2020</a> survey',
  },

  {
    cat: 'Maintenance',
    metric: 'releases',
    label: 'Npm releases',
    labelSub: `in ${prevQuarter}`,
    tooltip: `Npm releases number in ${prevQuarter}`,
  },

  {
    cat: 'Maintenance',
    metric: 'commits',
    label: 'Commits',
    labelSub: `in ${prevQuarter}`,
    tooltip: `Repository commits number in ${prevQuarter}`,
  },

  {
    cat: 'Maintenance',
    metric: 'contributors',
    label: 'Contributors',
    labelSub: `in ${prevQuarter}`,
    tooltip: `Contributors number in ${prevQuarter}`,
  },

  {
    cat: 'Miscellaneous',
    metric: 'dependencies',
    label: 'Dependencies',
    tooltip: 'Npm dependencies number',
  },

  {
    cat: 'Miscellaneous',
    metric: 'bundlesize',
    label: 'Bundle size',
    tooltip:
      'Bundle size of the npm package minified+gzipped. Data source: <a href="https://bundlephobia.com/" target="_blank">Bundlephobia.com</a>',
  },

  {
    cat: 'Miscellaneous',
    metric: 'ts',
    label: 'Types',
    tooltip:
      '<p>TypeScript support.</p> <p>"BUNDLED" - typings are bundled together with the package.</p> <p>"SEPARATE" - typings are published to the @types organization on Npm</p>',
  },

  {
    cat: 'Miscellaneous',
    metric: 'tradar',
    label: 'Tech Radar',
    tooltip:
      '<p>A ThoughtWorks tech radar “ring” assigned to the library.</p> <p>Four possible rings - “Adopt”, “Trial”, “Assess”, and “Hold”.</p>',
  },

  {
    cat: 'Miscellaneous',
    metric: 'security',
    label: 'Security score',
    tooltip:
      '<p>Security score of the Npm package.</p> <p><a href="https://snyk.io/" target="_blank">Snyk.io</a> calculates it based on the number of vulnerabilities and their severity.</p> "A" - no vulnerabilities, "F" - the least secure level.',
  },

  {
    cat: 'Miscellaneous',
    metric: 'vulnerability',
    label: 'Vulnerabilities',
    tooltip:
      '<p>Vulnerabilities found in the repository.</p> <p>Data source: <a href="https://snyk.io/" target="_blank">Snyk.io</a></p>',
  },

  { cat: 'Miscellaneous', metric: 'age', label: 'Age' },
  { cat: 'Miscellaneous', metric: 'license', label: 'License' },
];
