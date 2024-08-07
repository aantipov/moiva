// Types and simple helpers shared between /src project and /functions
import type { DeepReadonly } from 'vue';
import type { AlternativesObjectT } from 'functions-helpers/fetchPackageAIAlternatives';

/**
 * AI HANDLING
 */
type AiResponseMetaT = {
  version: number;
  model: string;
  tokensUsed: number | undefined;
  createdAt: string;
};

// AI response when it finds the package abnd generates a proper answer
type AiResponseFoundT = {
  description: string[];
  tags: string[];
  alternatives: string[] | AlternativesObjectT;
  isDeprecated: boolean;
};
type AiResponseNotFoundT = { notFound: true };
export type AiResponseT = AiResponseFoundT | AiResponseNotFoundT;

type KvAiFoundT = AiResponseFoundT & AiResponseMetaT;

// AI response when it doesn't find the package
type KvAiNotFoundT = AiResponseNotFoundT & AiResponseMetaT;

// null when the AI response is not yet generated
export type KvAiT =
  | KvAiFoundT
  | DeepReadonly<KvAiFoundT>
  | KvAiNotFoundT
  | DeepReadonly<KvAiNotFoundT>
  | null;

export function hasAiInfo(obj: KvAiT): obj is KvAiFoundT {
  return !!obj && (obj as KvAiFoundT).description !== undefined;
}

/**
 * AI COMPARE HANDLING
 */

// AI response when it finds the package abnd generates a proper answer
export type AiCompareResponseFoundT = {
  title: string;
  description: string;
}[];
export type AiCompareResponseT = AiCompareResponseFoundT | AiResponseNotFoundT;
export type KvAiCompareT =
  | ({
      data: AiCompareResponseFoundT | AiResponseNotFoundT;
    } & AiResponseMetaT)
  | null;

export type NpmCompareApiResponseT =
  | AiCompareResponseFoundT
  | AiResponseNotFoundT;

export function hasAiCompareInfo(
  obj: NpmCompareApiResponseT | null,
): obj is AiCompareResponseFoundT {
  return !!obj && Array.isArray(obj) && obj.length > 0;
}

/**
 * NPM INFO HANDLING
 */
export interface NpmJsResponseT {
  name: string;
  description: string;
  dependencies?: Record<string, string>;
  license: string;
  version: string;
  repository?: {
    type: string;
    url: string;
  };
  homepage: string;
  typings: string;
  types: string;
  deprecated?: string;
}
export type NpmInfoApiResponseT = {
  npm: Omit<
    NpmJsResponseT,
    'types' | 'typings' | 'dependencies' | 'deprecated'
  > & {
    dependencies: string[];
    hasBuiltinTypes: boolean;
    hasOtherTypes: boolean;
    typesPackageName: string;
    repoId: string | null; // null if package doesn't have proper github repo info
    deprecated: string | null;
    publishedAt: string; // publishedAt is received from a separate request
    createdAt: string; // createdAt is received from a separate request
  };
  ai: KvAiT;
  repo: {
    repoId: string;
    repoName: string;
    homepageUrl: string;
    description: string;
    isArchived?: boolean; // optional for transitional period (api cache expiration)
    stars: number;
    createdAt: string;
    lastCommitAt: string;
    closedIssues: number;
    closedBugIssues: number;
    openIssues: number;
    openBugIssues: number;
    licenseInfo: {
      key: string;
      name: string;
      url: string;
    } | null;
  } | null; // null if npm package doesn't contain proper github repo info
};
export type KvNpmInfoT = {
  data: NpmInfoApiResponseT;
  createdAt: string;
};
