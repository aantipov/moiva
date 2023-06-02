<template>
  <div style="min-height: 50vh">
    <VueQueryDevTools />

    <div class="content container antialiased">
      <!-- <Search class="mx-auto w-full lg:w-9/12 xl:w-2/4" @select="select" /> -->
      <Suggestions @select="select" />
      <div
        v-if="isLoading && !librariesRR.length"
        class="relative mx-auto w-full lg:w-9/12 xl:w-2/4"
        style="min-height: 200px"
      >
        <LoaderNew class="items-center" />
      </div>
    </div>

    <!--  Selected Libraries and Charts    -->
    <section v-if="librariesRR.length">
      <div class="container mt-4 text-center lg:w-9/12 xl:w-2/4">
        <Title />

        <a href="/">[Clear selection]</a>
      </div>

      <Table category="" class="container mt-4 mb-12 lg:w-3/4" />

      <Readings class="container mb-12" />

      <!-- POPULARITY -->
      <section
        class="bg-green-600/90 pb-12 pt-8"
        :class="{ [CAT_CONFIG['Popularity'].bgColor]: true }"
      >
        <div class="container">
          <h2 class="mt-0 mb-6 text-white">Popularity</h2>

          <Table category="Popularity" class="mt-4 mb-12" />

          <div class="grid grid-cols-12 gap-8">
            <NpmDownloads
              v-if="chartsVisibilityRO.npmDownloads"
              class="popchartmany"
            />
            <Stars
              :class="popularChartsNumber === 1 ? 'popchart1' : 'popchartmany'"
            />
            <GoogleTrends
              v-if="chartsVisibilityRO.googleTrends"
              class="popchartmany"
            />
            <DevelopersUsage
              v-if="chartsVisibilityRO.developerUsage"
              class="popchartmany"
            />
          </div>
        </div>
      </section>

      <!-- MAINTENANCE -->
      <section
        class="bg-orange-600/80 pb-12 pt-8"
        :class="{ [CAT_CONFIG['Maintenance'].bgColor]: true }"
      >
        <div class="container">
          <h2 class="mt-0 mb-6 text-black/80">
            Maintenance and Development Activity
          </h2>

          <Table category="Maintenance" class="mt-4 mb-12" />

          <div class="grid grid-cols-12 gap-8">
            <Releases
              v-if="chartsVisibilityRO.npmReleases"
              class="maintchart3"
            />
            <Contributors
              :class="maintChartsNumber === 2 ? 'maintchart2' : 'maintchart3'"
            />
            <Commits
              :class="maintChartsNumber === 2 ? 'maintchart2' : 'maintchart3'"
            />
          </div>
        </div>
      </section>

      <!-- MISC -->
      <section
        class="bg-indigo-600/80 pb-12 pt-8"
        :class="{ [CAT_CONFIG['Miscellaneous'].bgColor]: true }"
      >
        <div class="container">
          <h2 class="mt-0 mb-6 text-white">Miscellaneous</h2>

          <Table category="Miscellaneous" class="mt-4 mb-12" />

          <div class="grid grid-cols-12 gap-8">
            <Languages
              :class="miscChartsNumber === 1 ? 'miscchart1' : 'miscchartmany'"
            />
            <TechRadar
              v-if="chartsVisibilityRO.techRadar"
              class="miscchartmany"
            />
          </div>
        </div>
      </section>
    </section>
  </div>
</template>

<script setup lang="ts">
import '@/chartjs.config';
import { onMounted, watchEffect, computed, readonly } from 'vue';
import { VueQueryDevTools } from 'vue-query/devtools';

import LoaderNew from '@/components/LoaderNew.vue';

import NpmDownloads from '@/components/downloads/NpmDownloadsChart.vue';
import Title from '@/components/Title.vue';
// import Search from '@/components/search/Search.vue';
import Suggestions from '@/components/Suggestions.vue';
import Table from '@/components/table/Table.vue';
import Readings from '@/components/Readings.vue';

import Releases from '@/components/npm-releases/NpmReleasesChart.vue';
import TechRadar from '@/components/TechRadarChart.vue';
import GoogleTrends from '@/components/google-trends/GTrendsChart.vue';
import Stars from '@/components/github-stars/StarsChart.vue';
import Languages from '@/components/languages/LanguagesChart.vue';
import Contributors from '@/components/github-contributors/ContributorsChart.vue';
import DevelopersUsage from '@/components/developer-usage/DeveloperUsageChart.vue';
import Commits from '@/components/commits/CommitsChart.vue';

import { CAT_CONFIG } from '@/components/table/TableConfig';
import {
  getNpmPackagesFromUrl,
  getReposIdsFromUrl,
  setNoFollowTag,
  showErrorMsg,
} from '@/utils';
import { updateLibrariesColors } from '@/store/librariesColors';
import {
  isLoading,
  librariesRR,
  librariesIds,
  addLibraryByNpmPackage,
  addLibraryByRepo,
  removeAllLibraries,
} from '@/store/libraries';
import useExtraDataApiLegacy, {
  useExtraDataApi,
} from '@/composables/useExtraDataApi';
import { useDocumentTitle } from '@/composables/useDocumentTitle';
import { useDocumentDescription } from '@/composables/useDocumentDescription';
import { useUrl } from '@/composables/useUrl';
import * as Sentry from '@sentry/vue';
import { useChartsVisibility } from './composables/useChartsVisibility';
import {
  $addedSearchNpmPackage,
  $addedSearchRepo,
} from '@/nanostore/addedSearchValue';
import { onSet } from 'nanostores';

onSet($addedSearchNpmPackage, ({ newValue }) => {
  addLibraryByNpmPackage(newValue as string);
});
onSet($addedSearchRepo, ({ newValue }) => {
  addLibraryByRepo(newValue as string);
});

// Do not allow Google index pages with >=3 libraries
setNoFollowTag();

// Keep up-to-date the mapping Library <=> Color
watchEffect(() => updateLibrariesColors(librariesIds.value));

onMounted(() => {
  // Load the libraries defined in the URL
  const npmPackagesNamesFromUrl = getNpmPackagesFromUrl();
  const reposIdsFromUrl = getReposIdsFromUrl();
  Promise.all([
    ...npmPackagesNamesFromUrl.map(addLibraryByNpmPackage),
    ...reposIdsFromUrl.map(addLibraryByRepo),
  ]).catch(() => {
    // Redirect a user to 404 if there was a wrong lib in the url
    // This is needed for SEO - Google should not crawl "bad" pages
    window.location.href = '/not-found';
  });

  // Load libraries extra data
  useExtraDataApiLegacy();
});

// Keep Title, Description and Url in sync with the selected libraries
useDocumentTitle();
useDocumentDescription();
useUrl();
useExtraDataApi();
const chartsVisibilityRO = readonly(useChartsVisibility());

const popularChartsNumber = computed(
  () =>
    [
      chartsVisibilityRO.npmDownloads,
      chartsVisibilityRO.googleTrends,
      chartsVisibilityRO.developerUsage,
      true,
    ].filter(Boolean).length
);

const maintChartsNumber = computed(
  () => [chartsVisibilityRO.npmReleases, true, true].filter(Boolean).length
);

const miscChartsNumber = computed(
  () => [chartsVisibilityRO.techRadar, true].filter(Boolean).length
);

// User uses Back/Forward Browser buttons
window.onpopstate = () => {
  const urlParams = new URLSearchParams(document.location.search);
  const npmPackages = urlParams.get('npm')?.split(' ');
  const githubRepos = urlParams.get('github')?.split(' ');
  removeAllLibraries();
  if (npmPackages) {
    npmPackages.forEach((name) => selectNpmPackage(name));
  }
  if (githubRepos) {
    githubRepos.forEach((name) => selectRepo(name));
  }
};

function selectNpmPackage(npmPackageName: string): void {
  addLibraryByNpmPackage(npmPackageName).catch(() => {
    showErrorMsg(
      `Sorry, we couldn't fetch data for
      <span class="font-mono">${npmPackageName}</span>:
      npm package doesn't have repository information
      `
    );
    const err = new Error(`npmPackage: ${npmPackageName}`);
    err.name = 'UI: Select Npm Package Error';
    Sentry.captureException(err, {
      tags: { npmPackage: npmPackageName },
    });
    return null;
  });
}

function selectRepo(repoId: string): void {
  addLibraryByRepo(repoId).catch(() => {
    showErrorMsg(`Sorry, we couldn't fetch data for ${repoId}`);
    return Promise.reject();
  });
}

function select(id: string, isNpm: boolean) {
  if (isNpm) {
    selectNpmPackage(id);
  } else {
    selectRepo(id);
  }
}
</script>

<style lang="postcss" scoped>
.popchart1 {
  @apply col-span-12 shadow-xl md:col-span-8 md:col-start-3 lg:col-span-6 lg:col-start-4;
}
.popchartmany {
  @apply col-span-12 shadow-xl md:col-span-6;
}
.maintchart2 {
  @apply col-span-12 shadow-xl md:col-span-6 xl:col-span-5;
}
.maintchart2:first-child {
  @apply xl:col-start-2;
}
.maintchart3 {
  @apply col-span-12 shadow-xl md:col-span-6 xl:col-span-4;
}
.miscchart1 {
  @apply col-span-12 shadow-xl md:col-span-6 md:col-start-4;
}
.miscchartmany {
  @apply col-span-12 shadow-xl md:col-span-6 xl:col-span-5;
}
.miscchartmany:first-child {
  @apply xl:col-start-2;
}
</style>
