import { atom } from 'nanostores';
import { LibraryT } from '@/getLibrary';

type DeepReadonly<T> = T extends (infer R)[]
  ? ReadonlyArray<DeepReadonly<R>>
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

export type TrimmedLibraryT = DeepReadonly<
  Pick<
    LibraryT,
    'tags' | 'catalogLibraryId' | 'id' | 'npmPackage' | 'repo' | 'alias' | 'ai'
  >
>;
export const $trimmedLibraries = atom<TrimmedLibraryT[]>([]);
export const $isLoading = atom<boolean>(false);
