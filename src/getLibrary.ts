import { computed } from 'vue';
import { nanoid } from 'nanoid';
import { differenceInMilliseconds } from 'date-fns';
import {
  type ContributorsT,
  cacheR as contributorsMapR,
} from '@/components/github-contributors/api';
import {
  type NpmPackageReleasesT,
  cacheR as npmReleasesMapR,
  creationDatesCacheR as npmCreationDatesMapR,
} from '@/components/npm-releases/api';
import {
  type NpmDownloadT,
  cacheR as npmDownloadsMapR,
} from '@/components/downloads/api';
import {
  gTrendsQueryRef,
  commitsQueriesRef,
  starsQueriesRef,
} from '@/composables/useExtraDataApi';
import { type LibGTrendsDataT } from '@/queries/useGTrendsQuery';
import { type UseCommitsQueriesResultT } from '@/queries/useCommitsQueries';
import { type UseStarsQueriesResultT } from '@/queries/useStarsQueries';
import {
  repoIdToDevUsageDataMap,
  repoIdToTechRadarMap,
  repoToGTrendDefMap,
  npmToPlaygroundMap,
  type StateOfJSItemT,
  type TechRadarT,
  type CatalogLibraryT,
  type GTrendDefT,
} from '@/data/index';
import {
  type BundlephobiaT,
  cacheR as bundlesizeMapR,
} from '@/components/bundle-size/api';
import {
  type LanguagesT,
  cacheR as languagesMapR,
} from '@/components/languages/api';
import { libraryToColorMapR } from '@/store/librariesColors';
import readings from '@/data/readings.json';
import licenses from '@/data/licenses.json';
import type { NpmInfoApiResponseT } from './shared-types';

type LibNpmDownloadsT = NpmDownloadT[] | null | undefined;

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

export type LicenseTypeT = 'permissive' | 'restrictive' | 'unknown';

export interface LibraryT {
  id: string;
  catalogLibraryId: number | null; //index in the catalogLibraries list
  color: string;
  category: string | null;
  tags: string[]; // tags of the Catalog library
  repo: NpmInfoApiResponseT['repo'];
  alias: string;
  age: number; // number of seconds since creation
  playground: string | null;
  tradar: TechRadarT | null;
  isNpmCoreArtifact: boolean | null;
  /**
   * @deprecated use 'npm' field instead
   */
  npmPackage: NpmInfoApiResponseT['npm']; // deprecated. Duplicate of 'npm' below
  npm: NpmInfoApiResponseT['npm'];
  ai: NpmInfoApiResponseT['ai'];
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
  commitsQuery: UseCommitsQueriesResultT[number] | null;
  languages: LanguagesT | null | undefined;
  license: LicenseT | null | undefined;
  licenseType: LicenseTypeT;
  googleTrends: {
    data: LibGTrendsDataT | undefined;
    isFetching: boolean;
    isError: boolean;
    meta: GTrendDefT;
  } | null;
  devUsage: StateOfJSItemT | undefined;
  devUsageLast: number | undefined;
  starsQuery: UseStarsQueriesResultT[number] | null;
  readings: ReadingT[];
}

export function getLibrary(
  npmApiResponse: NpmInfoApiResponseT,
  catalogLibrary: CatalogLibraryT | null,
): LibraryT {
  const { npm, repo, ai } = npmApiResponse;
  const isNpmCoreArtifact = catalogLibrary?.isNpmCoreArtifact ?? null;
  const category = (catalogLibrary && catalogLibrary.category) || null;
  const tags = (catalogLibrary && catalogLibrary.tags) || [];
  const id = nanoid();
  const repoIdLC = repo ? repo.repoId.toLowerCase() : null;
  const license = (() => {
    const licenseKey = npm.license?.toLowerCase();

    return licenseKey ? licenses.find((item) => item.key === licenseKey) : null;
  })() as LicenseT | null;

  return {
    id,
    catalogLibraryId: catalogLibrary?.id ?? null,
    repo,
    npmPackage: npm, // deprecated in favor of 'npm' prop
    npm,
    ai,
    category,
    tags,
    isNpmCoreArtifact,
    alias: catalogLibrary?.alias || npm.name,
    // Use @ts-ignore because the Computed Ref will eventually become Reactive and then Typescript will start arguing
    // @ts-ignore
    age: computed(() =>
      differenceInMilliseconds(new Date(), new Date(npm.createdAt)),
    ),
    playground: npmToPlaygroundMap[npm.name] || null,
    tradar: repoIdToTechRadarMap[npm.name] || null,
    // @ts-ignore
    license,
    licenseType: (() => {
      if (license?.key === 'mit') {
        return 'permissive';
      } else if (license?.key === 'apache-2.0') {
        return 'restrictive';
      } else {
        return 'unknown';
      }
    })(),
    // @ts-ignore
    color: computed(() => libraryToColorMapR.get(id) || '#ffffff'),
    // @ts-ignore
    contributors: computed(() =>
      repoIdLC ? contributorsMapR.get(repoIdLC) : null,
    ),
    // @ts-ignore
    contributorsLastQ: computed(() => {
      if (!repoIdLC) {
        return undefined;
      }

      const contributors = contributorsMapR.get(repoIdLC);

      if (!contributors) {
        return undefined;
      }

      return contributors.slice(-1)[0].contributors;
    }),
    // @ts-ignore
    npmCreationDate: computed(() => npmCreationDatesMapR.get(npm.name)),
    // @ts-ignore
    npmDependencies: computed(() => npm.dependencies.length ?? undefined),
    // @ts-ignore
    npmReleases: computed(() => npmReleasesMapR.get(npm.name)),
    // @ts-ignore
    npmReleasesLastQ: computed(
      () => npmReleasesMapR.get(npm.name)?.slice(-1)[0].releases,
    ),
    // @ts-ignore
    npmDownloads: computed(() => npmDownloadsMapR.get(npm.name)),

    // @ts-ignore
    npmDownloadsAvg: computed(() => {
      const npmDownloads = npmDownloadsMapR.get(npm.name);

      if (!npmDownloads) {
        return undefined;
      }

      const qDownloads = npmDownloads
        .slice(-4, -1) // we don't take the last one because it's not complete
        .map(({ downloads }) => downloads);

      if (qDownloads.length === 0) {
        return 0;
      }

      const sum = qDownloads.reduce((sum, val) => sum + val, 0);

      return sum / qDownloads.length;
    }),

    npmDownloadsGrowth: computed(() => {
      const npmDownloads = npmDownloadsMapR.get(npm.name);
      if (!npmDownloads) {
        return undefined;
      }

      const downloads = npmDownloads.map((val) => val.downloads);
      const last = downloads.at(-2); // we don't take the last one because it's not complete
      const first = downloads.at(-7);

      if (!first || !last) {
        return null;
      }

      return 100 * (Math.pow(last / first, 1 / 5) - 1);
    }) as unknown as number | undefined | null,
    // @ts-ignore
    starsQuery: computed(() =>
      repoIdLC ? starsQueriesRef.value.get(repoIdLC) : null,
    ),
    // @ts-ignore
    bundlesize: computed(() => bundlesizeMapR.get(npm.name)),
    devUsage: (repoIdLC && repoIdToDevUsageDataMap[repoIdLC]) || undefined,
    devUsageLast:
      (repoIdLC &&
        repoIdToDevUsageDataMap[repoIdLC]?.usage.slice(-1)[0].value) ||
      undefined,
    // @ts-ignore
    googleTrends: computed(() => {
      if (!repoIdLC) {
        return null;
      }
      if (!repoToGTrendDefMap[repoIdLC] || !gTrendsQueryRef.value) {
        return null;
      }
      const { data, isFetching, isError } = gTrendsQueryRef.value;
      return {
        data: data?.get(repoIdLC),
        isFetching,
        isError,
        meta: repoToGTrendDefMap[repoIdLC],
      };
    }),
    // @ts-ignore
    commitsQuery: computed(() =>
      repoIdLC ? commitsQueriesRef.value.get(repoIdLC) : null,
    ),
    // @ts-ignore
    languages: computed(() => (repoIdLC ? languagesMapR.get(repoIdLC) : null)),
    // @ts-ignore
    readings: computed(() => {
      return (readings as ReadingT[]).filter((item) =>
        item.npms.includes(npm.name),
      );
    }),
  };
}
