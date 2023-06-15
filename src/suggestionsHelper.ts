import {
  catalogLibraries,
  CatalogLibraryT,
  frameworksTags,
  genericTags,
} from '@/data/index';
import 'sweetalert2/dist/sweetalert2.css';
import { TrimmedLibraryT } from '@/nanostore/trimmedLibraries';
// @ts-ignore
// import { Document } from 'flexsearch';
import pkg from 'flexsearch';
const { Document } = pkg;

interface SearchResultsItemT {
  tag: string;
  result: number[]; // List of libs ids [100, 258, 264] - indexes in Libraries Catalog Index
}

interface SearchLibT {
  lib: CatalogLibraryT;
  hasMatchedWorthyTags: boolean; // A flag denoting if a library has a "worthy" tag in common with the selected libraries
  matchedTags: string[]; // A list of tags in common with the selected libraries (worthy and non-worthy)
  matchedTagsNumber: number; // we need it to sort found libraries
}

// Init and build search index for catalog libraries
const index = new Document({
  document: {
    id: 'id',
    content: 'alias',
    tag: 'tags',
  },
});
catalogLibraries.forEach((lib) => index.add(lib));

/**
 * Get Library suggestions for the selected libs
 * based on tags
 */
export function getSuggestions(
  selectedLibraries: readonly TrimmedLibraryT[]
): CatalogLibraryT[] {
  if (!selectedLibraries.length) {
    return [];
  }

  // Tags of selected libraries
  const tagsUsed = [
    ...new Set(selectedLibraries.map((lib) => lib.tags).flat()),
  ] as string[];

  const tagsUsedNoFrameworks = tagsUsed.filter(
    (tag) => !frameworksTags.includes(tag)
  ) as string[];

  const tagsUsedWorthy = tagsUsed.filter(
    (tag) => !frameworksTags.includes(tag) && !genericTags.includes(tag)
  ) as string[];

  const tagsUsedFrameworks = tagsUsed.filter((tag) =>
    frameworksTags.includes(tag)
  ) as string[];

  // Search Libs Catalog Index for tags
  const tagsResults = index.search({
    tag: tagsUsedNoFrameworks,
  }) as SearchResultsItemT[];

  const keyToLibMap = new Map<number, SearchLibT>();

  tagsResults.forEach((tagResultItem) => {
    const tagLibsKeys = tagResultItem.result; // list of libs ids [0, 4, 8] (indexes in catalogLibraries)
    const tag = tagResultItem.tag;
    tagLibsKeys.forEach((libKey) => {
      if (!keyToLibMap.get(libKey)) {
        keyToLibMap.set(libKey, {
          lib: catalogLibraries[libKey],
          hasMatchedWorthyTags: tagsUsedWorthy.includes(tag),
          matchedTags: [],
          matchedTagsNumber: 0,
        });
      }
      const lib = keyToLibMap.get(libKey) as SearchLibT;
      if (!lib.hasMatchedWorthyTags) {
        lib.hasMatchedWorthyTags = tagsUsedWorthy.includes(tag);
      }
      lib.matchedTags.push(tag);
      lib.matchedTagsNumber++;
    });
  });

  const selectedLibsIds = selectedLibraries.map(
    (item) => item.catalogLibraryId
  );
  const suggestedLibs: CatalogLibraryT[] = [...keyToLibMap.values()]
    // TODO: sort libs by more specific tags, e.g. browser-automation vs testing (e2e libs)
    // TODO: sort libs by stars rate
    // Do not include libraries which don't have any worhy tags in common with the selected libraries
    .filter((item) => item.hasMatchedWorthyTags)
    .sort((a, b) => b.matchedTagsNumber - a.matchedTagsNumber)
    .map((item) => item.lib)
    // filter out selected libraries
    .filter((item) => !selectedLibsIds.includes(item.id))
    // Sort to the end framework specific libs which do not match currently selected
    .sort((libA, libB) => {
      const isLibAFavourable =
        libA.framework === null || tagsUsedFrameworks.includes(libA.framework);
      const isLibBFavourable =
        libB.framework === null || tagsUsedFrameworks.includes(libB.framework);
      if (isLibAFavourable && isLibBFavourable) {
        return 0;
      }
      if (isLibAFavourable) return -1;
      return 1;
    });

  return suggestedLibs;
}
