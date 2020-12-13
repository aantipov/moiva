import { LibraryT, fetchNpmPackage } from './apis';

const paramName = 'compare';
const oldParamName = 'apps';
const delimiter = ' ';

/**
 * A function to ensure the url is valid
 * It is called only once during the initial page load
 */
function cleanupUrl(validLibsFromUrl: string[]): void {
  const Url = new URL(window.location.href);

  // Make sure the old parameter is not licked
  Url.searchParams.delete(oldParamName);

  // Do nothing if the URL doesn't have the parameter (loading root page use case)
  if (Url.searchParams.get(paramName) === null) {
    return;
  }

  // Delete the parameter if no valid libs are provided via url
  if (!validLibsFromUrl.length) {
    Url.searchParams.delete(paramName);
    window.history.replaceState(null, '', Url.href);
    return;
  }

  // Update url with the valid libs in the right order
  Url.searchParams.set(paramName, validLibsFromUrl.sort().join(delimiter));
  window.history.replaceState(null, '', Url.href);
}

// Update URL whenever a user selects/deselects a library
// TODO: do we need to update the document title?
export function updateUrl(selectedLibs: string[]): void {
  const Url = new URL(window.location.href);

  if (!selectedLibs.length) {
    Url.searchParams.delete(paramName);
    window.history.pushState(null, '', Url.href);
    return;
  }

  const selectedLibsUrlnames = selectedLibs.sort();

  Url.searchParams.set(paramName, selectedLibsUrlnames.join(delimiter));
  window.history.pushState(null, '', Url.href);
}

export function loadDefaultLibs(): Promise<LibraryT[]> {
  const Url = new URL(window.location.href);
  const defaultLibs = Url.searchParams.get(paramName)?.split(delimiter) || [];
  const uniqDefaultLibs = [...new Set(defaultLibs)];

  const promises = uniqDefaultLibs.map(fetchNpmPackage);

  return Promise.all(promises).then((libs) => {
    const filteredLibs = libs.filter((lib) => !!lib) as LibraryT[];

    cleanupUrl(filteredLibs.map((lib) => lib.name));

    return filteredLibs;
  });
}

export const numbersFormatter = new Intl.NumberFormat('en-US', {
  // @ts-ignore
  notation: 'compact',
});
