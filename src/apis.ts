import axios from 'axios';
import { appsConfigsMap } from '../apps-config';

const npmCache = new Map();
const ghCache = new Map();

export interface NpmDownloadT {
  downloads: number;
  month: string;
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

  return axios
    .get(`/api/npm?app=${appsConfigsMap[app].npm.name}`)
    .then(({ data }) => {
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
