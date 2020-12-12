import { LibraryT, fetchNpmPackage } from './apis';

const paramName = 'compare';
const oldParamName = 'apps';
const delimiter = ' ';

function cleanupUrl(libs: string[]): void {
  const Url = new URL(window.location.href);

  // Make sure the old parameter is not licked
  Url.searchParams.delete(oldParamName);

  // Make sure the url is valid - update it if not empty
  if (!libs.length) {
    Url.searchParams.delete(paramName);
    window.history.replaceState(null, '', Url.href);
    return;
  }

  Url.searchParams.set(paramName, libs.sort().join(delimiter));
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
  const defaultLibs = Url.searchParams.get(paramName)?.split(delimiter) || [
    'vue',
    'react',
    'svelte',
  ];
  const uniqDefaultLibs = [...new Set(defaultLibs)];

  const promises = uniqDefaultLibs.map(fetchNpmPackage);

  return Promise.all(promises).then((libs) => {
    const filteredLibs = libs.filter((lib) => !!lib) as LibraryT[];

    cleanupUrl(filteredLibs.map((lib) => lib.name));

    return filteredLibs;
  });
}
