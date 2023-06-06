/**
 *  We should allow Google to index pages with 1 or 2 npm packages only
 *
 * @param npmPackages
 * @param reposIds
 * @returns {boolean}
 */
export function isSEOPage(npmPackages: string[], reposIds: string[]): boolean {
  return (
    (npmPackages.length === 1 || npmPackages.length === 2) && !reposIds.length
  );
}

export function getSEOTitle(npmPackages: string[]): string {
  if (npmPackages.length === 1) {
    return `"${npmPackages[0]}" NPM Package: Comprehensive Analysis, Alternatives, and Usage Statistics | Moiva.io`;
  }
  // TODO: add support for multiple packages
  return 'Moiva.io - Discover and Compare GitHub and NPM packages';
}

export function getSEODescription(npmPackages: string[]): string {
  if (npmPackages.length === 1) {
    return `Explore our in-depth analysis of the "${npmPackages[0]}" NPM package. Discover its distinct features, use-cases, alternatives, and comprehensive comparison metrics. Explore detailed statistics like NPM downloads, Github star trends, Google search interest, and more.`;
  }
  // TODO: add support for multiple packages
  return 'A complete side-by-side Comparison of NPM packages. Stats and Historical Trends - Bundle size, Downloads, GitHub Stars, License, Contributors, Releases, Commits, Developer usage, Google Trends, Vulnerabilities, Dependencies, Issues, Age and more';
}
