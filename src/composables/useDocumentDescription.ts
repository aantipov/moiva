import { watchEffect } from 'vue';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import { sortLibsByAlias, numbersFormatter } from '@/utils';
import { useMetaDescription } from '@/composables/useMetaDescription';
import { LibrariesReadonlyT } from '@/libraryApis';
import { isLoading, librariesRR } from '@/store/libraries';

interface LibForDescriptionT {
  alias: string;
  description: string;
  starsCount: string;
  age: string;
}

export function useDocumentDescription(): void {
  const descr = useMetaDescription();
  // Update descritpion on every library change (load, de-load)
  watchEffect(() => {
    // Wait until all libraries are finished loading
    if (isLoading.value) {
      return;
    }

    descr.value = getDescription(librariesRR);
  });
}

function getDescription(libraries: LibrariesReadonlyT): string {
  let descr = `A complete side-by-side Comparison of NPM packages.
     Stats and Historical Trends - Bundle size, Downloads, GitHub Stars, License, Contributors, Releases, Commits, Developer usage, Google Trends, Vulnerabilities, Dependencies, Issues, Age and more`;

  const libs = [...libraries].sort(sortLibsByAlias).map((lib) => {
    const { description, stars, createdAt } = lib.repo;

    return {
      alias: lib.alias,
      description,
      starsCount: numbersFormatter.format(stars),
      age: formatDistanceToNowStrict(new Date(createdAt)),
    };
  });

  if (libs.length === 1) {
    descr = getSingleLibDescription(libs[0]);
  } else if (libs.length === 2) {
    descr = getTwoLibsDescription(libs[0], libs[1]);
  } else if (libs.length === 3) {
    descr = getThreeLibsDescription(libs[0], libs[1], libs[2]);
  } else if (libs.length > 3) {
    const aliasesStr = libs.map(({ alias }) => alias).join(', ');
    descr = `Compare ${aliasesStr}. Stats and Historical Trends - Bundle size, Downloads, GitHub Stars, License, Contributors, Releases, Commits, Developer usage, Google Trends, Vulnerabilities, Dependencies, Issues, Age and more`;
  }

  return descr;
}

function getSingleLibDescription(lib: LibForDescriptionT): string {
  const { alias, description, starsCount, age } = lib;
  const seoDescrIntro = (description || '')
    .toLowerCase()
    .startsWith(alias.toLowerCase())
    ? description
    : `${alias}. ${description}`;

  const words = seoDescrIntro.split(' ');
  let seoDescrIntroCut =
    words.length <= 11 ? seoDescrIntro : words.slice(0, 11).join(' ') + '...';

  // Make sure there is a dot in the end
  if (seoDescrIntroCut.slice(-1) !== '.') {
    seoDescrIntroCut += '.';
  }

  return `${seoDescrIntroCut} 
    &#9733;${starsCount} stars, ${age} old...
    Discover alternatives and compare them side-by-side`;
}

function getTwoLibsDescription(
  libA: LibForDescriptionT,
  libB: LibForDescriptionT
): string {
  return `Compare ${libA.alias} and ${libB.alias} side-by-side. Stats and Historical Trends.
${libA.alias}: &#9733;${libA.starsCount} stars, ${libA.age} old...
${libB.alias}: &#9733;${libB.starsCount} stars, ${libB.age} old...
`;
}

function getThreeLibsDescription(
  libA: LibForDescriptionT,
  libB: LibForDescriptionT,
  libC: LibForDescriptionT
): string {
  return `Which is better ${libA.alias}, ${libB.alias}, or ${libC.alias}? Compare Stats and Trends side-by-side.
${libA.alias}: &#9733;${libA.starsCount} stars, ${libA.age} old...
${libB.alias}: &#9733;${libB.starsCount} stars, ${libB.age} old...
${libC.alias}: &#9733;${libC.starsCount} stars, ${libC.age} old...
`;
}
