/**
 *  We should allow Google to index pages with 1 or 2 npm packages only
 *
 * @param npmPackages
 * @returns {boolean}
 */
export function isSEOPage(npmPackages: string[]): boolean {
  return npmPackages.length <= 2;
}

export function getSEOTitle(npmPackages: string[]): string {
  if (npmPackages.length === 0) {
    return 'NPM Packages Comparison | Performance, Security & Trends';
  } else if (npmPackages.length === 1) {
    return `${npmPackages[0]} NPM Package: Comprehensive Analysis, Alternatives, and Usage Statistics | Moiva.io`;
  } else {
    return `${npmPackages.join(
      ' vs '
    )}: Detailed NPM Packages Comparison | Performance, Security & Trends`;
  }
}

export function getSEODescription(npmPackages: string[]): string {
  if (npmPackages.length === 0) {
    return `Compare NPM packages and make informed decisions. Explore detailed statistics like NPM downloads, Github star trends, Google search interest, and more. Empower your tech stack decisions with data-driven insights.`;
  } else if (npmPackages.length === 1) {
    return `Explore our in-depth analysis of the ${npmPackages[0]} NPM package. Discover its distinct features, use-cases, alternatives, and comprehensive comparison metrics. Explore detailed statistics like NPM downloads, Github star trends, Google search interest, and more.`;
  } else {
    return `In-depth comparison of ${npmPackages
      .slice(0, -1)
      .join(', ')} and ${npmPackages.at(
      -1
    )} npm packages, offering insights on bundle size, download trends, Google search interest, GitHub Stars, license, contributors activity, security scores, tech radar blips, and more. Empower your tech stack decisions with data-driven insights.`;
  }
}
