<template>
  <div style="min-height: 50vh">
    <div class="container mt-8 antialiased content">
      <Search class="w-full mx-auto lg:w-9/12 xl:w-2/4" @select="select" />
      <Suggestions @select="select" />

      <!--  Popular Comparisons    -->
      <div v-if="!librariesRR.length">
        <Popular v-if="!isLoading" class="mb-8" @select="selectMultiple" />

        <div
          v-else
          class="relative w-full mx-auto lg:w-9/12 xl:w-2/4"
          style="min-height: 200px"
        >
          <m-loader-new class="items-center" />
        </div>
      </div>
    </div>

    <!--  Selected Libraries and Charts    -->
    <section v-if="librariesRR.length">
      <div class="container mt-4 text-center lg:w-9/12 xl:w-2/4">
        <Title />

        <a href="/" @click.prevent="clearSelection">[Clear selection]</a>
      </div>

      <Table class="container mt-4 mb-12 lg:w-3/4" />

      <Readings class="container mb-12" />

      <!-- Charts -->
      <section class="pb-12 pt-8 bg-green-500">
        <div class="container">
          <h2 class="mt-0 mb-6 text-white">
            Popularity
            <span class="text-lg font-normal">over time</span>
          </h2>
          <div class="grid grid-cols-12 gap-8">
            <template v-if="popularChartsNumber === 1">
              <Stars
                class="
                  col-span-12
                  md:col-span-8 md:col-start-3
                  lg:col-span-6 lg:col-start-4
                "
              />
              <NpmDownloads />
              <GoogleTrends />
              <DevelopersUsage />
            </template>
            <template v-else>
              <NpmDownloads class="col-span-12 md:col-span-6" />
              <GoogleTrends class="col-span-12 md:col-span-6" />
              <Stars class="col-span-12 md:col-span-6" />
              <DevelopersUsage class="col-span-12 md:col-span-6" />
            </template>
          </div>
        </div>
      </section>

      <section class="pb-12 pt-8 bg-yellow-400">
        <div class="container">
          <h2 class="mt-0 mb-6">
            Maintenance and Development Activity
            <span class="text-lg font-normal">over time</span>
          </h2>
          <div class="grid grid-cols-12 gap-8">
            <template v-if="maintChartsNumber === 2">
              <Releases />
              <Contributors
                class="col-span-12 md:col-span-6 xl:col-span-5 xl:col-start-2"
              />
              <Commits class="col-span-12 md:col-span-6 xl:col-span-5" />
            </template>
            <template v-else-if="maintChartsNumber === 3">
              <Releases class="col-span-12 md:col-span-6 xl:col-span-4" />
              <Contributors class="col-span-12 md:col-span-6 xl:col-span-4" />
              <Commits class="col-span-12 md:col-span-6 xl:col-span-4" />
            </template>
          </div>
        </div>
      </section>

      <section class="pb-12 pt-8 bg-indigo-500">
        <div class="container">
          <h2 class="mt-0 mb-6 text-white">Miscellaneous</h2>

          <div class="grid grid-cols-12 gap-8">
            <template v-if="miscChartsNumber === 1">
              <Languages class="col-span-12 md:col-span-6 md:col-start-4" />
              <TechRadar />
            </template>
            <template v-else-if="miscChartsNumber === 2">
              <Languages
                class="col-span-12 md:col-span-6 xl:col-span-5 xl:col-start-2"
              />
              <TechRadar class="col-span-12 md:col-span-6 xl:col-span-5" />
            </template>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watchEffect, computed } from 'vue';
import NpmDownloads from '@/components/downloads/NpmDownloadsChart.vue';
import Title from '@/components/Title.vue';
import Search from '@/components/search/Search.vue';
import Suggestions from '@/components/Suggestions.vue';
import Popular from '@/components/Popular.vue';
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

import { chartsVisibility } from '@/store/chartsVisibility';
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
import useExtraDataApi from '@/composables/useExtraDataApi';
import { useDocumentTitle } from '@/composables/useDocumentTitle';
import { useDocumentDescription } from '@/composables/useDocumentDescription';
import { useUrl } from '@/composables/useUrl';
import * as Sentry from '@sentry/vue';

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
  useExtraDataApi();
});

// Keep Title, Description and Url in sync with the selected libraries
useDocumentTitle();
useDocumentDescription();
useUrl();

const popularChartsNumber = computed(
  () =>
    [
      chartsVisibility.npmDownloads,
      chartsVisibility.googleTrends,
      chartsVisibility.developerUsage,
      true,
    ].filter(Boolean).length
);

const maintChartsNumber = computed(
  () => [chartsVisibility.npmReleases, true, true].filter(Boolean).length
);

const miscChartsNumber = computed(
  () => [chartsVisibility.techRadar, true].filter(Boolean).length
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

function selectMultiple(npmPackagesNames: string[]): void {
  npmPackagesNames.forEach(selectNpmPackage);
}

function clearSelection() {
  removeAllLibraries();
}
</script>
