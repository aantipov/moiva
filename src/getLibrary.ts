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
import { libraryToColorMapR } from '@/store/librariesColors';
import { RepoT, NpmPackageT } from '@/libraryApis';
import readings from '@/data/readings.json';
import licenses from '@/data/licenses.json';

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

export type StatusT = 'ACTIVE' | 'INACTIVE' | 'LEGACY' | 'ARCHIVED';

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
  playground: string | null;
  tradar: TechRadarT | null;
  isNpmCoreArtifact: boolean | null;
  npmPackage: NpmPackageT;
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
  repo: RepoT,
  npmPackage: NpmPackageT,
  catalogLibrary: CatalogLibraryT | null
): LibraryT {
  const isNpmCoreArtifact = catalogLibrary?.isNpmCoreArtifact ?? null;
  const category = (catalogLibrary && catalogLibrary.category) || null;
  const tags = (catalogLibrary && catalogLibrary.tags) || [];
  const id = nanoid();
  const repoIdLC = repo.repoId.toLowerCase();
  const license = (() => {
    const licenseKey =
      npmPackage?.license?.toLowerCase() ||
      repo.licenseInfo?.key?.toLowerCase();

    return licenseKey ? licenses.find((item) => item.key === licenseKey) : null;
  })() as LicenseT | null;

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
      const commits = commitsQueriesRef.value.get(repoIdLC);
      if (commits?.data) {
        const lastSixMonthCommits = commits.data.commits.slice(-26);
        const hasNoCommits = lastSixMonthCommits.every(
          (item) => item.total === 0
        );
        if (hasNoCommits) {
          return 'INACTIVE';
        }
      }
      return 'ACTIVE';
    }),
    playground: (npmPackage && npmToPlaygroundMap[npmPackage.name]) || null,
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
    starsQuery: computed(() => starsQueriesRef.value.get(repoIdLC)),
    // @ts-ignore
    bundlesize: computed(() =>
      npmPackage ? bundlesizeMapR.get(npmPackage.name) : null
    ),
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
