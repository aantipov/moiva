import rawJson from '@/data/techradar.json';

const HOLD = 'Hold';
const ADOPT = 'Adopt';
const TRIAL = 'Trial';
const ASSESS = 'Assess';

type TRadarLevelT = typeof HOLD | typeof ADOPT | typeof TRIAL | typeof ASSESS;

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

type RepoNameT = string;
type AliasT = string;
type LinkT = string;

interface EntryT {
  month: DateT;
  level: TRadarLevelT;
}

export interface TechRadarT {
  repo: RepoNameT;
  alias: AliasT;
  link: LinkT;
  entries: EntryT[];
}

const libs = rawJson as [RepoNameT, AliasT, LinkT, EntryT[]][];

export const repoToTechRadarMap = libs.reduce(
  (accum, [repo, alias, link, entries]) => {
    accum[repo.toLowerCase()] = { repo, alias, link, entries };
    return accum;
  },
  {} as Record<string, TechRadarT>
);
