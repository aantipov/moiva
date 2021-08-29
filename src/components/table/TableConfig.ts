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

export interface MetricDataT {
  metric: MetricT;
  cat: CategoryT;
  classVal: string;
  label: string;
  labelSub?: string;
  labelMore?: string;
  tooltip?: string;
}

export const ROWS: MetricDataT[] = [
  { metric: 'npm', cat: '', classVal: '', label: 'Npm' },

  {
    metric: 'repo',
    cat: '',
    classVal: '',
    label: 'GitHub',
    tooltip: 'GitHub repository',
  },

  {
    metric: 'status',
    cat: '',
    classVal: '',
    label: 'Status',
    tooltip:
      '<p>Library status. Possible values:</p><p>- "Active"<br> - "Inactive" if no commits in the last 6 months<br> - "Legacy" if library authors called it so<br> - "Archived" if the repository is archived</p>',
  },

  { metric: 'tags', cat: '', classVal: '', label: 'Tags' },

  {
    metric: 'stars',
    cat: 'Popularity',
    classVal: 'bg-green-100',
    label: 'Stars',
    labelSub: 'in total',
    labelMore: 'and monthly growth',
    tooltip:
      'The total number of GitHub stars and the average number of new stars per month over the last 3 months',
  },

  {
    metric: 'downloads',
    cat: 'Popularity',
    classVal: 'bg-green-100',
    label: 'Npm Downloads',
    labelSub: 'monthly',
    labelMore: 'and monthly growth',
    tooltip:
      'The average number of Npm downloads per month over the last 3 months. The average monthly Npm downloads growth over the last 6 months',
  },

  {
    metric: 'searchInterest',
    cat: 'Popularity',
    classVal: 'bg-green-100',
    label: 'Search Interest, %',
    tooltip:
      'An average Google search interest in relation to other libraries.',
  },

  {
    metric: 'devusage',
    cat: 'Popularity',
    classVal: 'bg-green-100',
    label: 'Developer Usage, %',
    tooltip:
      'Percentage of developers using the library according to the latest <a href="https://stateofjs.com/" target="_blank">StateOfJS 2020</a> survey',
  },

  {
    metric: 'releases',
    cat: 'Maintenance',
    classVal: 'bg-yellow-100',
    label: 'Npm releases',
    labelSub: `in ${prevQuarter}`,
    tooltip: `Npm releases number in ${prevQuarter}`,
  },

  {
    metric: 'commits',
    cat: 'Maintenance',
    classVal: 'bg-yellow-100',
    label: 'Commits',
    labelSub: `in ${prevQuarter}`,
    tooltip: `Repository commits number in ${prevQuarter}`,
  },

  {
    metric: 'contributors',
    cat: 'Maintenance',
    classVal: 'bg-yellow-100',
    label: 'Contributors',
    labelSub: `in ${prevQuarter}`,
    tooltip: `Contributors number in ${prevQuarter}`,
  },

  {
    metric: 'dependencies',
    cat: 'Miscellaneous',
    classVal: 'bg-purple-100',
    label: 'Dependencies',
    tooltip: 'Npm dependencies number',
  },

  {
    metric: 'bundlesize',
    cat: 'Miscellaneous',
    classVal: 'bg-purple-100',
    label: 'Bundle size',
    tooltip:
      'Bundle size of the npm package minified+gzipped. Data source: <a href="https://bundlephobia.com/" target="_blank">Bundlephobia.com</a>',
  },

  {
    metric: 'ts',
    cat: 'Miscellaneous',
    classVal: 'bg-purple-100',
    label: 'Types',
    tooltip:
      '<p>TypeScript support.</p> <p>"BUNDLED" - typings are bundled together with the package.</p> <p>"SEPARATE" - typings are published to the @types organization on Npm</p>',
  },

  {
    metric: 'tradar',
    cat: 'Miscellaneous',
    classVal: 'bg-purple-100',
    label: 'Tech Radar',
    tooltip:
      '<p>A ThoughtWorks tech radar “ring” assigned to the library.</p> <p>Four possible rings - “Adopt”, “Trial”, “Assess”, and “Hold”.</p>',
  },

  {
    metric: 'security',
    cat: 'Miscellaneous',
    classVal: 'bg-purple-100',
    label: 'Security score',
    tooltip:
      '<p>Security score of the Npm package.</p> <p><a href="https://snyk.io/" target="_blank">Snyk.io</a> calculates it based on the number of vulnerabilities and their severity.</p> "A" - no vulnerabilities, "F" - the least secure level.',
  },

  {
    metric: 'vulnerability',
    cat: 'Miscellaneous',
    classVal: 'bg-purple-100',
    label: 'Vulnerabilities',
    tooltip:
      '<p>Vulnerabilities found in the repository.</p> <p>Data source: <a href="https://snyk.io/" target="_blank">Snyk.io</a></p>',
  },

  {
    metric: 'age',
    cat: 'Miscellaneous',
    classVal: 'bg-purple-100',
    label: 'Age',
  },

  {
    metric: 'license',
    cat: 'Miscellaneous',
    classVal: 'bg-purple-100',
    label: 'License',
  },
];
