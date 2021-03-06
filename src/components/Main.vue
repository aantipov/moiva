<template>
  <div>
    <Search class="w-full mx-auto lg:w-9/12 xl:w-2/4" @select="select" />
    <Suggestions @select="select" />

    <!--  Popular Comparisons    -->
    <div v-if="!libraries.length">
      <Popular v-if="!isLoading" @select="selectMultiple" />

      <div
        v-else
        class="relative w-full mx-auto lg:w-9/12 xl:w-2/4"
        style="min-height: 200px"
      >
        <m-loader-new class="items-center" />
      </div>
    </div>

    <!--  Selected Libraries and Charts    -->
    <section v-else>
      <div class="mx-auto mt-4 text-center lg:w-9/12 xl:w-2/4">
        <Title />

        <a
          v-tooltip="`Clear selection`"
          href="/"
          @click.prevent="clearSelection"
          >[Clear selection]</a
        >
      </div>

      <Table class="w-full mx-auto mt-4 mb-12 lg:w-3/4" />

      <Readings class="mb-12" />

      <!-- Charts -->
      <section class="mb-12">
        <h2>
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
      </section>

      <section class="mb-12">
        <h2>
          Maintenance and Development Activity
          <span class="text-lg font-normal">over time</span>
        </h2>
        <div class="grid grid-cols-12 gap-8">
          <Releases class="col-span-12 md:col-span-6 xl:col-span-4" />
          <Contributors class="col-span-12 md:col-span-6 xl:col-span-4" />
          <Commits class="col-span-12 md:col-span-6 xl:col-span-4" />
        </div>
      </section>

      <section>
        <h2>Miscellaneous</h2>

        <div class="grid grid-cols-12 gap-8">
          <template v-if="miscChartsNumber === 1">
            <Languages
              class="
                col-span-12
                md:col-span-6 md:col-start-4
                xl:col-span-4 xl:col-start-5
              "
            />
            <TechRadar />
            <Bundlephobia :category="category" />
          </template>
          <template v-else-if="miscChartsNumber === 2">
            <Languages
              class="col-span-12 md:col-span-6 xl:col-span-4 xl:col-start-3"
            />
            <TechRadar class="col-span-12 md:col-span-6 xl:col-span-4" />
            <Bundlephobia
              :category="category"
              class="col-span-12 md:col-span-6 xl:col-span-4"
            />
          </template>
          <template v-else>
            <Languages class="col-span-12 md:col-span-6 xl:col-span-4" />
            <TechRadar class="col-span-12 md:col-span-6 xl:col-span-4" />
            <Bundlephobia
              :category="category"
              class="col-span-12 md:col-span-6 xl:col-span-4"
            />
          </template>
        </div>
      </section>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watchEffect, computed } from 'vue';
import NpmDownloads from './downloads/NpmDownloadsChart.vue';
import Title from './Title.vue';
import Search from './search/Search.vue';
import Suggestions from './Suggestions.vue';
import Popular from './Popular.vue';
import Table from './table/Table.vue';
import Readings from './Readings.vue';

import Releases from './npm-releases/ReleasesChart.vue';
import TechRadar from './TechRadar.vue';
import GoogleTrends from './google-trends/GTrendsChart.vue';
import Stars from './github-stars/StarsChart.vue';
import Bundlephobia from './bundle-size/BundlephobiaChart.vue';
import Languages from './languages/LanguagesChart.vue';
import Contributors from './github-contributors/ContributorsChart.vue';
import DevelopersUsage from './developer-usage/DeveloperUsageChart.vue';
import Commits from './commits/CommitsChart.vue';

import { chartsVisibility } from '@/store/chartsVisibility';
import {
  updateUrl,
  updateTitle,
  updateMetaDescription,
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
  categoryRef,
  addLibraryByNpmPackage,
  addLibraryByRepo,
  removeAllLibraries,
} from '@/store/libraries';
import useExtraDataApi from '@/composables/useExtraDataApi';
import * as Sentry from '@sentry/browser';

export default defineComponent({
  name: 'Main',
  components: {
    Title,
    Popular,
    Search,
    Suggestions,
    Table,
    Readings,

    Bundlephobia,
    Stars,
    Commits,
    Contributors,
    DevelopersUsage,
    GoogleTrends,
    Languages,
    NpmDownloads,
    Releases,
    TechRadar,
  },

  setup() {
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

      // On every Library change (load, de-load) update url, title, description
      watchEffect(() => {
        if (isLoading.value) {
          return;
        }

        // Update URL, Title and Meta Description
        updateUrl(librariesRR);
        updateTitle(librariesRR);
        updateMetaDescription(librariesRR);
      });

      // Load libraries extra data
      useExtraDataApi();
    });

    function selectNpmPackage(npmPackageName: string): void {
      addLibraryByNpmPackage(npmPackageName).catch(() => {
        showErrorMsg(
          `Sorry, we couldn't fetch data for <span class="font-mono">${npmPackageName}</span>`
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

    return {
      libraries: librariesRR,
      isLoading,
      chartsVisibility,
      select: (id: string, isNpm: boolean) => {
        if (isNpm) {
          selectNpmPackage(id);
        } else {
          selectRepo(id);
        }
      },
      selectMultiple(npmPackagesNames: string[]): void {
        npmPackagesNames.forEach(selectNpmPackage);
      },
      popularChartsNumber: computed(
        () =>
          [
            chartsVisibility.npmDownloads,
            chartsVisibility.googleTrends,
            chartsVisibility.developerUsage,
            true,
          ].filter(Boolean).length
      ),
      miscChartsNumber: computed(
        () =>
          [
            chartsVisibility.techRadar,
            chartsVisibility.bundlephobia,
            true,
          ].filter(Boolean).length
      ),
      category: categoryRef,
      clearSelection() {
        removeAllLibraries();
      },
    };
  },
});
</script>
