import { atom } from 'nanostores';

export const $addedNpmPackage = atom<string | null>(null);
export const $addedRepo = atom<string | null>(null);
export const $removedLibrary = atom<string | null>(null);
