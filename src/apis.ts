import axios from 'axios';

const npmCache = new Map();
const ghCache = new Map();
const gTrendsCache = new Map();
const bphobiaCache = new Map();

export interface NpmDownloadT {
  downloads: number;
  month: string;
}

export interface BundlephobiaT {
  gzip: number;
  raw: number;
}

export interface GTrendPointT {
  formattedAxisTime: string;
  formattedTime: string;
  formattedValue: string[];
  hasData: boolean[];
  time: number;
  value: number[];
}

export interface GTrendsT {
  averages: number[];
  timelineData: GTrendPointT[];
}

export interface RepoT {
  stars: number;
  createdAt: string;
  openPRs: { totalCount: number };
  closedPRs: { totalCount: number };
  mergedPRs: { totalCount: number };
  closedIssues: { totalCount: number };
  openIssues: { totalCount: number };
}

export function fetchNpmData(app: string): Promise<NpmDownloadT[]> {
  if (npmCache.get(app)) {
    return Promise.resolve(npmCache.get(app));
  }

  return axios.get(`/api/npm?app=${app}`).then(({ data }) => {
    npmCache.set(app, data);
    return data;
  });
}

export function fetchGithubData(app: string): Promise<RepoT> {
  if (ghCache.get(app)) {
    return Promise.resolve(ghCache.get(app));
  }

  return axios.get(`/api/gh?app=${app}`).then(({ data }) => {
    ghCache.set(app, data);
    return data;
  });
}

export function fetchGTrendsData(apps: string[]): Promise<GTrendsT> {
  // TODO: implement a proper cache
  const appsStr = apps.join(',');

  if (gTrendsCache.get(appsStr)) {
    return Promise.resolve(gTrendsCache.get(appsStr));
  }

  return axios.get(`/api/gtrends?apps=${appsStr}`).then(({ data }) => {
    gTrendsCache.set(appsStr, data.default);
    return data.default;
  });
}

export function fetchBundlephobiaData(lib: string): Promise<BundlephobiaT[]> {
  if (bphobiaCache.get(lib)) {
    return Promise.resolve(bphobiaCache.get(lib));
  }

  return axios.get(`/api/bphobia?lib=${lib}`).then(({ data }) => {
    bphobiaCache.set(lib, data);
    return data;
  });
}
