import { computed } from 'vue';
import { getSeoLibName } from '@/utils';
import { nanoid } from 'nanoid';
import { CatalogLibraryT } from '@/libraries-catalog';
import { TechRadarT, repoToTechRadarMap } from '@/techradar.config';
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
  repoIdToDataMap as repoIdToDevUsageDataMap,
  StateOfJSItemT,
} from '@/components/developer-usage/stateof-js-css-data';
import {
  BundlephobiaT,
  cacheR as bundlesizeMapR,
} from '@/components/bundle-size/api';
import { StarsT, cacheR as starsMapR } from '@/components/github-stars/api';
import { libraryToColorMapR } from '@/store/librariesColors';
import { RepoT, NpmPackageT } from '@/libraryApis';

type LibCommitsT = CommitsResponseItemT[] | null | undefined;
type LibNpmDownloadsT = NpmDownloadT[] | null | undefined;
type LibBundleSizeT = BundlephobiaT | null | undefined;
type LibStarsT = StarsT[] | null | undefined;

export interface LibraryT {
  id: string;
  color: string;
  npmPackage?: NpmPackageT | null;
  category?: string | null;
  isNpmAByProduct?: boolean | null;
  repo: RepoT;
  alias: string;
  tradar: TechRadarT | null;
  contributors: ContributorsT[] | null | undefined; // null for errors, undefined for not loaded yet
  npmCreationDate: string | null | undefined;
  npmReleases: NpmPackageReleasesT[] | null | undefined;
  npmDownloads: LibNpmDownloadsT;
  npmDownloadsGrowth: number | null | undefined;
  commits: LibCommitsT;
  googleTrends: LibGTrendsT | undefined;
  devUsage: StateOfJSItemT | undefined;
  bundlesize: LibBundleSizeT;
  stars: LibStarsT;
  starsNewAvg: number | null | undefined;
}

export function getLibrary(
  repo: RepoT,
  npmPackage: NpmPackageT | null,
  library: CatalogLibraryT
): LibraryT {
  const isNpmAByProduct = (library && library.isNpmAByProduct) || false;
  const category = (library && library.category) || null;
  const id = nanoid();

  return {
    id,
    repo,
    npmPackage,
    category,
    isNpmAByProduct,
    alias: getSeoLibName(repo.repoId),
    tradar: repoToTechRadarMap[repo.repoId] || null,
    // Use @ts-ignore because the Computed Ref will eventually become Reactive and then Typescript will start arguing
    // @ts-ignore
    color: computed(() => libraryToColorMapR.get(id) || '#ffffff'),
    // @ts-ignore
    contributors: computed(() => contributorsMapR.get(repo.repoId)),
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
    npmDownloadsGrowth: (computed(() => {
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
    }) as unknown) as number | undefined | null,
    // @ts-ignore
    stars: computed(() => starsMapR.get(repo.repoId.toLowerCase())),
    // @ts-ignore
    starsNewAvg: computed(() => {
      // Get avg number of new stars monthly (in the last 3 months)
      const stars = starsMapR.get(repo.repoId.toLowerCase());
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
    devUsage: repoIdToDevUsageDataMap[repo.repoId],
    // @ts-ignore
    googleTrends: computed(() => googleTrendsMapR.get(repo.repoId)),
    // @ts-ignore
    commits: computed(() => commitsMapR.get(repo.repoId)),
  };
}
