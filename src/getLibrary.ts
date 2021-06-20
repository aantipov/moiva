import { computed } from 'vue';
import { getSeoLibName } from '@/utils';
import { nanoid } from 'nanoid';
import {
  ContributorsT,
  cacheR as contributorsMapR,
} from '@/components/github-contributors/api';
import {
  NpmPackageReleasesT,
  cacheR as npmReleasesMapR,
  creationDatesCacheR as npmCreationDatesMapR,
} from '@/components/npm-releases/api';
import {
  CommitsResponseItemT,
  cacheR as commitsMapR,
} from '@/components/commits/api';
import {
  NpmDownloadT,
  cacheR as npmDownloadsMapR,
} from '@/components/downloads/api';
import {
  LibGTrendsT,
  cacheR as googleTrendsMapR,
} from '@/components/google-trends/api';
import {
  repoIdToDevUsageDataMap,
  repoIdToTechRadarMap,
  repoToGTrendDefMap,
  legacyLibraries,
  StateOfJSItemT,
  TechRadarT,
  CatalogLibraryT,
  GTrendDefT,
} from '@/data/index';
import {
  BundlephobiaT,
  cacheR as bundlesizeMapR,
} from '@/components/bundle-size/api';
import {
  LanguagesT,
  cacheR as languagesMapR,
} from '@/components/languages/api';
import { StarsT, cacheR as starsMapR } from '@/components/github-stars/api';
import { libraryToColorMapR } from '@/store/librariesColors';
import { RepoT, NpmPackageT } from '@/libraryApis';
import readings from '@/data/readings.json';

type LibCommitsT = CommitsResponseItemT[] | null | undefined;
type LibNpmDownloadsT = NpmDownloadT[] | null | undefined;
type LibStarsT = StarsT[] | null | undefined;

export interface ReadingT {
  url: string;
  title: string;
  npms: string[];
  repos: string[];
}

export type StatusT = 'ACTIVE' | 'INACTIVE' | 'LEGACY' | 'ARCHIVED';

export interface LibraryT {
  id: string;
  color: string;
  category: string | null;
  status: StatusT;
  repo: RepoT;
  alias: string;
  tradar: TechRadarT | null;
  isNpmCoreArtifact: boolean | null;
  npmPackage: NpmPackageT | null;
  npmCreationDate: string | null | undefined;
  npmReleases: NpmPackageReleasesT[] | null | undefined;
  npmDownloads: LibNpmDownloadsT;
  npmDownloadsGrowth: number | null | undefined;
  bundlesize: BundlephobiaT | null | undefined;
  contributors: ContributorsT[] | null | undefined; // null for errors, undefined for not loaded yet
  commits: LibCommitsT;
  languages: LanguagesT | null | undefined;
  googleTrendsDef: GTrendDefT | null; // null if no config
  googleTrends: LibGTrendsT | undefined | null; // null for errors, undefined for not loaded yet
  devUsage: StateOfJSItemT | undefined;
  stars: LibStarsT;
  starsNewAvg: number | null | undefined;
  readings: ReadingT[];
}

export function getLibrary(
  repo: RepoT,
  npmPackage: NpmPackageT | null,
  library: CatalogLibraryT | null
): LibraryT {
  const isNpmCoreArtifact = library?.isNpmCoreArtifact ?? null;
  const category = (library && library.category) || null;
  const id = nanoid();
  const repoIdLC = repo.repoId.toLowerCase();

  return {
    id,
    repo,
    npmPackage,
    category,
    isNpmCoreArtifact,
    alias: library?.alias || getSeoLibName(repoIdLC),
    // Use @ts-ignore because the Computed Ref will eventually become Reactive and then Typescript will start arguing
    // @ts-ignore
    status: computed(() => {
      if (repo.isArchived) {
        return 'ARCHIVED';
      }
      if (legacyLibraries.find((lib) => lib.repoId === repo.repoId)) {
        return 'LEGACY';
      }
      const commits = commitsMapR.get(repoIdLC);
      if (commits) {
        const lastSixMonthCommits = commits.slice(-26);
        const hasNoCommits = lastSixMonthCommits.every(
          (item) => item.total === 0
        );
        if (hasNoCommits) {
          return 'INACTIVE';
        }
      }
      return 'ACTIVE';
    }),
    tradar: repoIdToTechRadarMap[repoIdLC] || null,
    // @ts-ignore
    color: computed(() => libraryToColorMapR.get(id) || '#ffffff'),
    // @ts-ignore
    contributors: computed(() => contributorsMapR.get(repoIdLC)),
    // @ts-ignore
    npmCreationDate: computed(() =>
      npmPackage ? npmCreationDatesMapR.get(npmPackage.name) : null
    ),
    // @ts-ignore
    npmReleases: computed(() =>
      npmPackage ? npmReleasesMapR.get(npmPackage.name) : null
    ),
    // @ts-ignore
    npmDownloads: computed(() =>
      npmPackage ? npmDownloadsMapR.get(npmPackage.name) : null
    ),
    npmDownloadsGrowth: computed(() => {
      if (!npmPackage) {
        return null;
      }
      const npmDownloads = npmDownloadsMapR.get(npmPackage.name);
      if (!npmDownloads) {
        return undefined;
      }

      const downloads = npmDownloads.map((val) => val.downloads);
      const last = downloads.slice(-1)[0];
      const first = downloads.slice(-6, -5)[0];

      if (!first || !last) {
        return null;
      }

      return 100 * (Math.pow(last / first, 1 / 6) - 1);
    }) as unknown as number | undefined | null,
    // @ts-ignore
    stars: computed(() => starsMapR.get(repoIdLC)),
    // @ts-ignore
    starsNewAvg: computed(() => {
      // Get avg number of new stars monthly (in the last 3 months)
      const stars = starsMapR.get(repoIdLC);
      if (!stars) {
        return stars; // null or undefined
      }
      const lastStars = stars.slice(-3);

      return (
        lastStars.map((val) => val.stars).reduce((acc, val) => acc + val, 0) /
        lastStars.length
      );
    }),
    // @ts-ignore
    bundlesize: computed(() =>
      npmPackage ? bundlesizeMapR.get(npmPackage.name) : null
    ),
    devUsage: repoIdToDevUsageDataMap[repoIdLC],
    googleTrendsDef: repoToGTrendDefMap[repoIdLC] || null,
    // @ts-ignore
    googleTrends: computed(() => googleTrendsMapR.get(repoIdLC)),
    // @ts-ignore
    commits: computed(() => commitsMapR.get(repoIdLC)),
    // @ts-ignore
    languages: computed(() => languagesMapR.get(repoIdLC)),
    // @ts-ignore
    readings: computed(() => {
      if (npmPackage) {
        return (readings as ReadingT[]).filter((item) =>
          item.npms.includes(npmPackage.name)
        );
      }
      return (readings as ReadingT[]).filter((item) =>
        item.repos.includes(repoIdLC)
      );
    }),
  };
}
