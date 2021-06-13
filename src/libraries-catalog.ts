import rawJson from '@/data/libraries.json';

export interface CatalogLibraryT {
  repoId: string;
  category: string;
  alias: string;
  npm?: string | null;
  isNpmAByProduct?: boolean | null;
  framework: string | null;
  isLegacy: boolean;
}

const libraries = rawJson as CatalogLibraryT[];

export const catalogRepoIdToLib = libraries.reduce((acc, lib) => {
  acc[lib.repoId.toLowerCase()] = lib;
  return acc;
}, {} as Record<string, CatalogLibraryT>);

// For use by npm-package api to return the correct repo for the npm package
export const catalogNpmToLib = libraries.reduce((acc, lib) => {
  if (lib.npm) {
    acc[lib.npm] = lib;
  }
  return acc;
}, {} as Record<string, CatalogLibraryT>);

export const catalogReposIdsByCategory = libraries.reduce(
  (acc, { repoId, category }) => {
    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(repoId.toLowerCase());

    return acc;
  },
  {} as Record<string, string[]>
);
