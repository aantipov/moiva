import configApps from '../apps-config';

// Validate URL's 'apps' parameter and remove wrong libs
export function cleanupUrl(): void {
  const Url = new URL(window.location.href);
  const appsUrlParam = Url.searchParams.get('apps');
  const appsFromUrl = appsUrlParam?.split('--') || [];
  const appsFromUrlValidated = appsFromUrl.filter(
    (urlApp) => !!configApps.find((app) => app.urlname === urlApp)
  );

  // Make sure the url is valid - update it if not empty
  if (!appsFromUrlValidated.length) {
    Url.searchParams.delete('apps');
    window.history.replaceState(null, '', Url.href);
  } else {
    Url.searchParams.set('apps', appsFromUrlValidated.join('--'));
    window.history.replaceState(null, '', Url.href);
  }
}
