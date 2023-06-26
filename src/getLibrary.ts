import { computed } from 'vue';
import { getSeoLibName } from '@/utils';
import { nanoid } from 'nanoid';
import { differenceInMilliseconds } from 'date-fns';
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
  NpmDownloadT,
  cacheR as npmDownloadsMapR,
} from '@/components/downloads/api';
import {
  gTrendsQueryRef,
  commitsQueriesRef,
  starsQueriesRef,
} from '@/composables/useExtraDataApi';
import { LibGTrendsDataT } from '@/queries/useGTrendsQuery';
import { UseCommitsQueriesResultT } from '@/queries/useCommitsQueries';
import { UseStarsQueriesResultT } from '@/queries/useStarsQueries';
import {
  repoIdToDevUsageDataMap,
  repoIdToTechRadarMap,
  repoToGTrendDefMap,
  npmToPlaygroundMap,
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
import { libraryToColorMapR } from '@/store/librariesColors';
import readings from '@/data/readings.json';
import licenses from '@/data/licenses.json';
import { NpmInfoApiResponseT } from './shared-types';

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
  commitsQuery: UseCommitsQueriesResultT[number];
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
  starsQuery: UseStarsQueriesResultT[number];
  readings: ReadingT[];
}

export function getLibrary(
  npmApiResponse: NpmInfoApiResponseT,
  catalogLibrary: CatalogLibraryT | null
): LibraryT {
  const { npm, repo, ai } = npmApiResponse;
  const isNpmCoreArtifact = catalogLibrary?.isNpmCoreArtifact ?? null;
  const category = (catalogLibrary && catalogLibrary.category) || null;
  const tags = (catalogLibrary && catalogLibrary.tags) || [];
  const id = nanoid();
  const repoIdLC = repo.repoId.toLowerCase();
  const license = (() => {
    const licenseKey =
      npm.license?.toLowerCase() || repo.licenseInfo?.key?.toLowerCase();

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
    alias: catalogLibrary?.alias || getSeoLibName(repoIdLC),
    // Use @ts-ignore because the Computed Ref will eventually become Reactive and then Typescript will start arguing
    // @ts-ignore
    age: computed(() =>
      differenceInMilliseconds(new Date(), new Date(repo.createdAt))
    ),
    playground: npmToPlaygroundMap[npm.name] || null,
    tradar: repoIdToTechRadarMap[repoIdLC] || null,
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
    npmCreationDate: computed(() => npmCreationDatesMapR.get(npm.name)),
    // @ts-ignore
    npmDependencies: computed(() => npm.dependencies.length ?? undefined),
    // @ts-ignore
    npmReleases: computed(() => npmReleasesMapR.get(npm.name)),
    // @ts-ignore
    npmReleasesLastQ: computed(
      () => npmReleasesMapR.get(npm.name)?.slice(-1)[0].releases
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
        .slice(-3)
        .map(({ downloads }) => downloads);
      const sum = qDownloads.reduce((sum, val) => sum + val, 0);

      return sum / qDownloads.length;
    }),

    npmDownloadsGrowth: computed(() => {
      const npmDownloads = npmDownloadsMapR.get(npm.name);
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
    starsQuery: computed(() => starsQueriesRef.value.get(repoIdLC)),
    // @ts-ignore
    bundlesize: computed(() => bundlesizeMapR.get(npm.name)),
    devUsage: repoIdToDevUsageDataMap[repoIdLC],
    devUsageLast: repoIdToDevUsageDataMap[repoIdLC]?.usage.slice(-1)[0].value,
    // @ts-ignore
    googleTrends: computed(() => {
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
    commitsQuery: computed(() => commitsQueriesRef.value.get(repoIdLC)),
    // @ts-ignore
    languages: computed(() => languagesMapR.get(repoIdLC)),
    // @ts-ignore
    readings: computed(() => {
      return (readings as ReadingT[]).filter((item) =>
        item.npms.includes(npm.name)
      );
    }),
  };
}
