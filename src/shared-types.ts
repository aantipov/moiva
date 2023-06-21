// Types and simple helpers shared between /src project and /functions
import { DeepReadonly } from 'vue';
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
  alternatives: string[];
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
}
export type NpmInfoApiResponseT = Omit<
  NpmJsResponseT,
  'types' | 'typings' | 'dependencies'
> & {
  dependencies: string[];
  hasBuiltinTypes: boolean;
  hasOtherTypes: boolean;
  typesPackageName: string;
  repoId: string; // we only allow packages with github repos info
  ai: KvAiT;
};
export type KvNpmInfoT = {
  data: NpmInfoApiResponseT;
  createdAt: string;
};
