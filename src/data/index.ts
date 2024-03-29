import rawStateOfJsItems from './stateofjscss.json';
import rawTechRadarItems from './techradar.json';
import rawLibraries from './libraries.json';
import rawGoogleTrendsItems from './google-trends.json';
import legacyItems from './legacy.json';
import pgItems from './playground.json';
import { frameworksTags } from './tags';
export * from './tags';

/** ========= STATE OF JS CSS ========= **/
/**
 * 1. stateofjs-entities.json file was generated first and includes only entities with Github data (I also had to enrich it manually because some known entities like VueJS didn't have Github data).
 * 2. then stateofjscss.json file was generated and included data from both surveys StateOfJS and StateOfCSS:
 * - included only items with Usage data
 * - included only items which are listed in the stateofjs-entities.json file from step 1.
 * - merge carefully items which existed in both surveys simultaneously
 */
export interface StateOfJSItemT {
  id: string;
  name: string;
  category: string;
  repoId: string;
  usage: { year: number; value: number }[];
}

export const repoIdToDevUsageDataMap = (
  rawStateOfJsItems as StateOfJSItemT[]
).reduce(
  (acc, item) => {
    acc[item.repoId.toLowerCase()] = item;
    return acc;
  },
  {} as Record<string, StateOfJSItemT>,
);

/** ========= THOUGHWORKS TECH RADAR ========= **/
const HOLD = 'Hold';
const ADOPT = 'Adopt';
const TRIAL = 'Trial';
const ASSESS = 'Assess';

export type TRadarLevelT =
  | typeof HOLD
  | typeof ADOPT
  | typeof TRIAL
  | typeof ASSESS;

export const TRADAR_LEVELS: TRadarLevelT[] = [HOLD, ASSESS, TRIAL, ADOPT];

export type DateT =
  | '2014-01'
  | '2014-07'
  | '2015-01'
  | '2015-05'
  | '2015-11'
  | '2016-04'
  | '2016-11'
  | '2017-03'
  | '2017-11'
  | '2018-05'
  | '2018-03'
  | '2018-11'
  | '2019-04'
  | '2019-11'
  | '2020-05'
  | '2020-10'
  | '2021-04';

type NpmNameT = string;
type AliasT = string;
type LinkT = string;

interface EntryT {
  month: DateT;
  level: TRadarLevelT;
}

export interface TechRadarT {
  npm: NpmNameT;
  alias: AliasT;
  link: LinkT;
  entries: EntryT[];
}

export const repoIdToTechRadarMap = (
  rawTechRadarItems as [NpmNameT, AliasT, LinkT, EntryT[]][]
).reduce(
  (accum, [npm, alias, link, entries]) => {
    accum[npm] = { npm, alias, link, entries };
    return accum;
  },
  {} as Record<string, TechRadarT>,
);

/** ========= PLAYGROUND ITEMS ========= **/
type pgNpmT = string;
type pgLink = string;
export const npmToPlaygroundMap = (pgItems as [pgNpmT, pgLink][]).reduce(
  (accum, [npm, link]) => {
    accum[npm] = link;
    return accum;
  },
  {} as Record<pgNpmT, pgLink>,
);

/** ========= LIBRARIES CATALOG ========= **/
interface CatalogLibraryNpmT {
  id: number; // index in the catalog libraries list
  npm: string; // unique
  isNpmCoreArtifact: boolean;
  repoId: string; // not unique (e.g. several npm packages from the same repo)
  category: string;
  tags: string[];
  alias: string;
  framework: string | null;
}
export type CatalogLibraryT = CatalogLibraryNpmT;

/**
 * Get Alias using the alias from the catalog or repository's name
 *
 */
function getAliasFromRepoId(repoId: string): string {
  const [, repoName] = repoId.split('/');

  // Capitalise normal names
  if (
    repoName.length > 2 &&
    !repoName.includes('@') &&
    !repoName.includes('/') &&
    !repoName.includes('-')
  ) {
    return repoName.charAt(0).toUpperCase() + repoName.slice(1);
  }

  return repoName;
}

export const catalogLibraries = rawLibraries
  .filter((lib) => lib.category !== 'misc' && lib.npm !== null)
  .map((lib, index) => ({
    ...lib,
    alias: lib.alias || getAliasFromRepoId(lib.repoId),
    framework: lib.tags.find((tag) => frameworksTags.includes(tag)) || null,
    id: index,
  })) as CatalogLibraryT[];

export const allCatalogLibraries = rawLibraries
  // .filter((lib) => lib.category !== 'misc' || lib.npm !== null)
  .map((lib, index) => ({
    ...lib,
    alias: lib.alias || getAliasFromRepoId(lib.repoId),
    framework: lib.tags.find((tag) => frameworksTags.includes(tag)) || null,
    id: index,
  })) as CatalogLibraryT[];

/**
 * Get a Npm Catalog Library by npm name
 * For use by npm-package api to return the correct repo for the npm package
 */
export function getNpmLibraryByNpm(
  npm: string,
): CatalogLibraryNpmT | undefined {
  return catalogLibraries.find((lib) => lib.npm === npm) as
    | CatalogLibraryNpmT
    | undefined;
}

/** ========= GOOGLE TRENDS ========= **/

type RepoIdT = string;
type KeywordT = string;
type KeywordAliasT = string; // To display on the chart. If not provided, then RepoName is used

const gtrendsDefs = rawGoogleTrendsItems as [
  RepoIdT,
  KeywordT,
  KeywordAliasT?,
][];

export interface GTrendDefT {
  repoId: string;
  keyword: string;
  alias: string;
}

export const repoToGTrendDefMap = gtrendsDefs.reduce(
  (accum, [repoId, keyword, keywordAlias]) => {
    accum[repoId.toLowerCase()] = {
      repoId,
      keyword,
      alias: capitalise(keywordAlias || repoId.slice(repoId.indexOf('/') + 1)),
    };
    return accum;
  },
  {} as Record<string, GTrendDefT>,
);

function capitalise(str: string): string {
  return str[0].toUpperCase() + str.slice(1);
}

export const GOOGLE_TRENDS_LIBS_LIMIT = 5;

/** =========== LEGACY ============== **/
export const legacyLibraries: NpmNameT[] = legacyItems;
