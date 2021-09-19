import { computed } from 'vue';
import { getSeoLibName } from '@/utils';
import { nanoid } from 'nanoid';
import { isSameQuarter, subQuarters, differenceInMilliseconds } from 'date-fns';
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
import {
  StarsT,
  cacheR as starsMapR,
  starsCumulateCacheR,
} from '@/components/github-stars/api';
import { libraryToColorMapR } from '@/store/librariesColors';
import { RepoT, NpmPackageT } from '@/libraryApis';
import readings from '@/data/readings.json';
import licenses from '@/data/licenses.json';

type LibCommitsT = CommitsResponseItemT[] | null | undefined;
type LibNpmDownloadsT = NpmDownloadT[] | null | undefined;
type LibStarsT = StarsT[] | null | undefined;

export interface ReadingT {
  url: string;
  title: string;
  npms: string[];
  repos: string[];
}

export interface LicenseT {
  key: string;
  description: string;
  url: string;
}

export type StatusT = 'ACTIVE' | 'INACTIVE' | 'LEGACY' | 'ARCHIVED';

const prevQuarterDate = subQuarters(new Date(), 1);

export interface LibraryT {
  id: string;
  catalogLibraryId: number | null; //index in the catalogLibraries list
  color: string;
  category: string | null;
  tags: string[]; // tags of the Catalog library
  status: StatusT;
  repo: RepoT;
  alias: string;
  age: number; // number of seconds since creation
  tradar: TechRadarT | null;
  isNpmCoreArtifact: boolean | null;
  npmPackage: NpmPackageT | null;
  npmCreationDate: string | null | undefined;
  npmDependencies: number | undefined;
  npmReleases: NpmPackageReleasesT[] | null | undefined;
  npmReleasesLastQ: number | undefined;
  npmDownloads: LibNpmDownloadsT;
  npmDownloadsAvg: number | null | undefined;
  npmDownloadsGrowth: number | null | undefined;
  bundlesize: BundlephobiaT | null | undefined;
  contributors: ContributorsT[] | null | undefined; // null for errors, undefined for not loaded yet
  contributorsLastQ: number | undefined;
  commits: LibCommitsT;
  commitsLastQ: number | undefined;
  languages: LanguagesT | null | undefined;
  license: LicenseT | null | undefined;
  googleTrendsDef: GTrendDefT | null; // null if no config
  googleTrends: LibGTrendsT | undefined | null; // null for errors, undefined for not loaded yet
  devUsage: StateOfJSItemT | undefined;
  devUsageLast: number | undefined;
  stars: LibStarsT;
  starsCumulate: LibStarsT;
  starsNewAvg: number | null | undefined;
  readings: ReadingT[];
}

export function getLibrary(
  repo: RepoT,
  npmPackage: NpmPackageT | null,
  catalogLibrary: CatalogLibraryT | null
): LibraryT {
  const isNpmCoreArtifact = catalogLibrary?.isNpmCoreArtifact ?? null;
  const category = (catalogLibrary && catalogLibrary.category) || null;
  const tags = (catalogLibrary && catalogLibrary.tags) || [];
  const id = nanoid();
  const repoIdLC = repo.repoId.toLowerCase();

  return {
    id,
    catalogLibraryId: catalogLibrary?.id ?? null,
    repo,
    npmPackage,
    category,
    tags,
    isNpmCoreArtifact,
    alias: catalogLibrary?.alias || getSeoLibName(repoIdLC),
    // Use @ts-ignore because the Computed Ref will eventually become Reactive and then Typescript will start arguing
    // @ts-ignore
    age: computed(() =>
      differenceInMilliseconds(new Date(), new Date(repo.createdAt))
    ),
    // @ts-ignore
    status: computed(() => {
      if (repo.isArchived) {
        return 'ARCHIVED';
      }
      if (
        legacyLibraries.find(
          (lib) =>
            (lib.repoId && lib.repoId === repo.repoId) ||
            (lib.npm && lib.npm === npmPackage?.name)
        )
      ) {
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
    license: computed(() => {
      const licenseKey =
        npmPackage?.license?.toLowerCase() ||
        repo.licenseInfo?.key?.toLowerCase();

      return licenseKey
        ? licenses.find((item) => item.key === licenseKey)
        : null;
    }),
    // @ts-ignore
    color: computed(() => libraryToColorMapR.get(id) || '#ffffff'),
    // @ts-ignore
    contributors: computed(() => contributorsMapR.get(repoIdLC)),
    // @ts-ignore
    contributorsLastQ: computed(() => {
      const contributors = contributorsMapR.get(repoIdLC);

      if (!contributors) {
        return undefined;
      }

      return contributors.slice(-1)[0].contributors;
    }),
    // @ts-ignore
    npmCreationDate: computed(() =>
      npmPackage ? npmCreationDatesMapR.get(npmPackage.name) : null
    ),
    // @ts-ignore
    npmDependencies: computed(
      () => npmPackage?.dependencies.length ?? undefined
    ),
    // @ts-ignore
    npmReleases: computed(() =>
      npmPackage ? npmReleasesMapR.get(npmPackage.name) : null
    ),
    // @ts-ignore
    npmReleasesLastQ: computed(() =>
      npmPackage
        ? npmReleasesMapR.get(npmPackage.name)?.slice(-1)[0].releases
        : undefined
    ),
    // @ts-ignore
    npmDownloads: computed(() =>
      npmPackage ? npmDownloadsMapR.get(npmPackage.name) : null
    ),

    // @ts-ignore
    npmDownloadsAvg: computed(() => {
      if (!npmPackage) {
        return null;
      }

      const npmDownloads = npmDownloadsMapR.get(npmPackage.name);

      if (!npmDownloads) {
        return undefined;
      }

      const qDownloads = npmDownloads
        .slice(-3)
        .map(({ downloads }) => downloads);
      const sum = qDownloads.reduce((sum, val) => sum + val, 0);

      return sum / qDownloads.length;
    }),

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
    starsCumulate: computed(() => starsCumulateCacheR.get(repoIdLC)),
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
    devUsageLast: repoIdToDevUsageDataMap[repoIdLC]?.usage.slice(-1)[0].value,
    googleTrendsDef: repoToGTrendDefMap[repoIdLC] || null,
    // @ts-ignore
    googleTrends: computed(() => googleTrendsMapR.get(repoIdLC)),
    // @ts-ignore
    commits: computed(() => commitsMapR.get(repoIdLC)),
    // @ts-ignore
    commitsLastQ: computed(() => {
      const commits = commitsMapR.get(repoIdLC);

      if (!Array.isArray(commits)) {
        return undefined;
      }

      // Get the numer of commits in the last quarter
      // Filter by the quarter and summarize
      return commits
        .filter(({ week }) => isSameQuarter(week * 1000, prevQuarterDate))
        .reduce((acc, { total }) => acc + total, 0);
    }),
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
