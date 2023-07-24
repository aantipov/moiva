import { reportSentry } from '@/apis';
import axios from 'axios';

const npmSearchCache = new Map();
const githubSearchCache = new Map();

export interface GithubSearchItem {
  repoId: string;
  description: string;
  updatedAt: string;
  isArchived: string;
  stars: number;
}

export interface NpmSearchItemT {
  name: string;
  description: string;
  version: string;
}

export function fetchGithubSearch(q: string): Promise<GithubSearchItem[]> {
  if (githubSearchCache.get(q)) {
    return Promise.resolve(githubSearchCache.get(q));
  }

  return axios
    .get<{ items: GithubSearchItem[] }>(
      `https://github-search.moiva.workers.dev/?q=${q}`,
    )
    .then(({ data }) => {
      githubSearchCache.set(q, data.items);
      return data.items;
    })
    .catch((err) => {
      reportSentry(err, 'fetchGithubSearch');
      return Promise.reject(err);
    });
}

export function fetchNpmSearch(keyword: string): Promise<NpmSearchItemT[]> {
  if (!keyword || keyword.length < 2) {
    return Promise.resolve([]);
  }

  if (npmSearchCache.get(keyword)) {
    return Promise.resolve(npmSearchCache.get(keyword));
  }

  // eslint-disable-next-line
  const fetchSuggestionsFunc = true
    ? fetchNpmJSSuggestions
    : fetchNpmsIOSuggestions;

  return fetchSuggestionsFunc(keyword)
    .then((data) => {
      npmSearchCache.set(keyword, data);

      return data;
    })
    .catch((err) => {
      reportSentry(err, 'fetchNpmSearch');
      return Promise.reject(err);
    });
}

function fetchNpmJSSuggestions(keyword: string): Promise<NpmSearchItemT[]> {
  return axios
    .get<{ items: NpmSearchItemT[] }>(
      `https://npm-search.moiva.workers.dev/?q=${keyword}`,
    )
    .then(({ data }) => data.items);
}

interface NpmsIOSuggestionResponseT {
  package: {
    name: string;
    description: string;
    version: string;
    links: {
      repository: string;
    };
  };
  score: {
    detail: {
      popularity: number;
    };
  };
  searchScore: number;
}

function fetchNpmsIOSuggestions(keyword: string): Promise<NpmSearchItemT[]> {
  return axios
    .get<NpmsIOSuggestionResponseT[]>(
      `https://api.npms.io/v2/search/suggestions?q=${keyword}&size=20`,
    )
    .then((resp) => {
      const suggestions = resp.data as NpmsIOSuggestionResponseT[];
      const data = suggestions
        .filter((lib) => !!lib.package.links.repository)
        .sort((a, b) => {
          if (b.searchScore - a.searchScore > 100) {
            return b.searchScore - a.searchScore;
          }
          return b.score.detail.popularity - a.score.detail.popularity;
        })
        .map(({ package: { name, description, version } }) => ({
          name,
          description,
          version,
        }));

      return data;
    });
}
