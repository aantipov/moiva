import { atom } from 'nanostores';
import { LibraryT } from '@/getLibrary';

export type TrimmedLibraryT = Pick<
  LibraryT,
  'tags' | 'catalogLibraryId' | 'id' | 'npmPackage' | 'repo'
>;
export const $trimmedLibraries = atom<TrimmedLibraryT[]>([]);
