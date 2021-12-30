import { TRadarLevelT } from '@/data';
import { LibraryT, LicenseTypeT, StatusT } from '@/getLibrary';
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
    tooltip:
      '<p>Library status. Possible values:</p><p>- "Active"<br> - "Inactive" if no commits in the last 6 months<br> - "Legacy" if library authors called it so<br> - "Archived" if the repository is archived</p>',
    sortFn: (a, b) => {
      const statusToValueMap: Record<StatusT, number> = {
        ACTIVE: 0,
        INACTIVE: 1,
        LEGACY: 2,
        ARCHIVED: 3,
      };
      return statusToValueMap[a.status] - statusToValueMap[b.status];
    },
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
    sortFn: (a, b) => {
      if (a.npmDownloadsAvg && b.npmDownloadsAvg) {
        return b.npmDownloadsAvg - a.npmDownloadsAvg;
      }
      return 0;
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
    sortFn: (a, b) => {
      if (!a.googleTrends && !b.googleTrends) {
        return 0;
      }
      if (!a.googleTrends) {
        return 1;
      }
      if (!b.googleTrends) {
        return -1;
      }

      // @ts-ignore
      return b.googleTrends.average - a.googleTrends.average;
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
    sortFn: (a, b) => b.repo.stars - a.repo.stars,
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
    sortFn: (a, b) => {
      if (!a.devUsage && !b.devUsage) {
        return 0;
      }
      if (!a.devUsage) {
        return 1;
      }
      if (!b.devUsage) {
        return -1;
      }

      const aValue = a.devUsage.usage.slice(-1)[0].value;
      const bValue = b.devUsage.usage.slice(-1)[0].value;

      // @ts-ignore
      return bValue - aValue;
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
    sortFn: (a, b) => {
      if (
        Number.isInteger(a.npmReleasesLastQ) &&
        Number.isInteger(b.npmReleasesLastQ)
      ) {
        // @ts-ignore
        return b.npmReleasesLastQ - a.npmReleasesLastQ;
      }
      return 0;
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
    sortFn: (a, b) => {
      if (
        Number.isInteger(a.contributorsLastQ) &&
        Number.isInteger(b.contributorsLastQ)
      ) {
        // @ts-ignore
        return b.contributorsLastQ - a.contributorsLastQ;
      }
      return 0;
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
    sortFn: (a, b) => {
      if (
        Number.isInteger(a.commitsLastQ) &&
        Number.isInteger(b.commitsLastQ)
      ) {
        // @ts-ignore
        return b.commitsLastQ - a.commitsLastQ;
      }
      return 0;
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
    sortFn: (a, b) => {
      if (
        Number.isInteger(a.npmDependencies) &&
        Number.isInteger(b.npmDependencies)
      ) {
        // @ts-ignore
        return a.npmDependencies - b.npmDependencies;
      }
      return 0;
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
    sortFn: (a, b) => {
      if (
        Number.isInteger(a.bundlesize?.gzip) &&
        Number.isInteger(b.bundlesize?.gzip)
      ) {
        // @ts-ignore
        return a.bundlesize.gzip - b.bundlesize.gzip;
      }
      return 0;
    },
  },

  {
    cat: 'Miscellaneous',
    metric: 'ts',
    label: 'Types',
    tooltip:
      '<p>TypeScript support.</p> <p>"BUNDLED" - typings are bundled together with the package.</p> <p>"SEPARATE" - typings are published to the @types organization on Npm</p>',
    sortFn: (a, b) => {
      const getValue = (x: LibraryT) => {
        if (x.npmPackage?.hasBuiltinTypes) {
          return 2;
        }
        if (x.npmPackage?.hasOtherTypes) {
          return 1;
        }
        return 0;
      };
      return getValue(a) - getValue(b);
    },
  },

  {
    cat: 'Miscellaneous',
    metric: 'tradar',
    label: 'Tech Radar',
    tooltip:
      '<p>A ThoughtWorks tech radar “ring” assigned to the library.</p> <p>Four possible rings - “Adopt”, “Trial”, “Assess”, and “Hold”.</p>',
    sortFn: (a, b) => {
      const tradarToValMap: Record<TRadarLevelT, number> = {
        Adopt: 0,
        Trial: 1,
        Assess: 2,
        Hold: 3,
      };
      const getValue = (x: LibraryT) => {
        const tradar = x.tradar?.entries.slice(-1)[0].level;
        return tradar ? tradarToValMap[tradar] : 4;
      };
      return getValue(a) - getValue(b);
    },
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
    sortFn: (a, b) => b.age - a.age,
  },
  {
    cat: 'Miscellaneous',
    metric: 'license',
    label: 'License',

    sortFn: (a, b) => {
      const licenseToValMap: Record<LicenseTypeT, number> = {
        permissive: 0,
        restrictive: 1,
        unknown: 2,
      };
      return licenseToValMap[a.licenseType] - licenseToValMap[b.licenseType];
    },
  },
];
