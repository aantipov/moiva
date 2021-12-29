import { LibraryT, StatusT } from '@/getLibrary';
import { prevQuarter } from '@/utils';
import { ascend } from 'ramda';

const METRICS = [
  'npm',
  'repo',
  'homepage',
  'status',
  'tags',
  'playground',
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
  bgHeaderColor: string;
  bgMetricColor: string;
  borderColor: string;
  textColor: string;
  separatorColor: string;
}

export const CAT_CONFIG: Record<CategoryT, CategoryConfigT> = {
  '': {
    bgColor: 'bg-green-600/90',
    bgHeaderColor: 'bg-primary',
    bgMetricColor: 'bg-gray-200',
    borderColor: 'border-primary',
    textColor: 'text-white',
    separatorColor: 'border-white/40',
  },

  Popularity: {
    bgColor: 'bg-green-600/90',
    bgHeaderColor: 'bg-green-700',
    bgMetricColor: 'bg-green-200 border-black/10',
    borderColor: 'border-black/10',
    textColor: 'text-white',
    separatorColor: 'border-white/40',
  },

  Maintenance: {
    bgColor: 'bg-orange-600/80',
    bgHeaderColor: 'bg-orange-700',
    bgMetricColor: 'bg-orange-200 border-black/10',
    borderColor: 'border-black/5',
    textColor: 'text-white',
    separatorColor: 'border-white/40',
  },

  Miscellaneous: {
    bgColor: 'bg-indigo-600/80',
    bgHeaderColor: 'bg-indigo-700',
    bgMetricColor: 'bg-indigo-200 border-black/10',
    borderColor: 'border-black/10',
    textColor: 'text-white',
    separatorColor: 'border-white/40',
  },
};

export interface MetricDataChartT {
  title: string;
  path: string;
  percent?: boolean;
  sortDirFn?: (_arg: any) => any;
  stepPrecision?: number; // number of decimals
}

export interface MetricDataT {
  metric: MetricT;
  cat: CategoryT;
  label: string;
  labelSub?: string;
  labelMore?: string;
  tooltip?: string;
  icon?: string;
  chart?: MetricDataChartT;
  sortFn?: (_a: LibraryT, _b: LibraryT) => number; // Sort from Best to Worst
}

export interface MetricDataWithChartT extends MetricDataT {
  chart: MetricDataChartT;
}

export const ROWS: MetricDataT[] = [
  { cat: '', metric: 'npm', label: 'Npm' },
  { cat: '', metric: 'repo', label: 'GitHub', tooltip: 'GitHub repository' },
  { cat: '', metric: 'homepage', label: 'Homepage', icon: 'm-home-icon' },

  {
    cat: '',
    metric: 'status',
    label: 'Status',
    labelMore: 'and last commit date',
    sortFn: (a, b) => {
      const statusToValueMap: Record<StatusT, number> = {
        ACTIVE: 0,
        INACTIVE: 1,
        LEGACY: 2,
        ARCHIVED: 3,
      };
      return statusToValueMap[a.status] - statusToValueMap[b.status];
    },
    tooltip:
      '<p>Library status. Possible values:</p><p>- "Active"<br> - "Inactive" if no commits in the last 6 months<br> - "Legacy" if library authors called it so<br> - "Archived" if the repository is archived</p>',
  },

  { metric: 'tags', cat: '', label: 'Tags' },

  { metric: 'playground', cat: '', label: 'Playground' },

  {
    cat: 'Popularity',
    metric: 'downloads',
    label: 'Npm Downloads',
    labelSub: 'monthly',
    labelMore: 'and monthly growth',
    tooltip:
      'The average number of Npm downloads per month over the last 3 months. The average monthly Npm downloads growth over the last 6 months',
    chart: {
      title: 'Npm Downloads, monthly',
      path: 'npmDownloadsAvg',
    },
  },

  {
    cat: 'Popularity',
    metric: 'searchInterest',
    label: 'Search Interest, %',
    tooltip:
      'An average Google search interest in relation to other libraries.',
    icon: 'm-search-icon',
    chart: {
      title: 'Search Interest, %',
      path: 'googleTrends.average',
      percent: true,
    },
  },

  {
    cat: 'Popularity',
    metric: 'stars',
    label: 'Stars',
    labelSub: 'in total',
    labelMore: 'and monthly growth',
    tooltip:
      'The total number of GitHub stars and the average number of new stars per month over the last 3 months',
    chart: {
      title: 'GitHub Stars',
      path: 'repo.stars',
    },
  },

  {
    cat: 'Popularity',
    metric: 'devusage',
    label: 'Developer Usage, %',
    tooltip:
      'Percentage of developers using the library according to the latest <a href="https://stateofjs.com/" target="_blank">StateOfJS 2020</a> survey',
    chart: {
      title: 'Developer Usage, %',
      path: 'devUsageLast',
      percent: true,
    },
  },

  {
    cat: 'Maintenance',
    metric: 'releases',
    label: 'Npm releases',
    labelSub: `in ${prevQuarter}`,
    tooltip: `Npm releases number in ${prevQuarter}`,
    chart: {
      title: `Npm Releases in ${prevQuarter}`,
      path: 'npmReleasesLastQ',
      stepPrecision: 0,
    },
  },

  {
    cat: 'Maintenance',
    metric: 'contributors',
    label: 'Contributors',
    labelSub: `in ${prevQuarter}`,
    tooltip: `Contributors number in ${prevQuarter}`,
    chart: {
      title: `Contributors in ${prevQuarter}`,
      path: 'contributorsLastQ',
      stepPrecision: 0,
    },
  },

  {
    cat: 'Maintenance',
    metric: 'commits',
    label: 'Commits',
    labelSub: `in ${prevQuarter}`,
    tooltip: `Repository commits number in ${prevQuarter}`,
    chart: {
      title: `Commits in ${prevQuarter}`,
      path: 'commitsLastQ',
      stepPrecision: 0,
    },
  },

  {
    cat: 'Miscellaneous',
    metric: 'dependencies',
    label: 'Dependencies',
    tooltip: 'Npm dependencies number',
    chart: {
      title: 'Npm Dependencies',
      path: 'npmDependencies',
      sortDirFn: ascend,
      stepPrecision: 0,
    },
  },

  {
    cat: 'Miscellaneous',
    metric: 'bundlesize',
    label: 'Bundle size',
    tooltip:
      'Bundle size of the npm package minified+gzipped. Data source: <a href="https://bundlephobia.com/" target="_blank">Bundlephobia.com</a>',
    chart: {
      title: 'Npm package bundle size (gzipped and minified), kB',
      path: 'bundlesize.gzipKb',
      sortDirFn: ascend,
    },
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

  {
    cat: 'Miscellaneous',
    metric: 'age',
    label: 'Age',
    chart: {
      title: 'Age',
      path: 'age',
    },
  },
  { cat: 'Miscellaneous', metric: 'license', label: 'License' },
];
