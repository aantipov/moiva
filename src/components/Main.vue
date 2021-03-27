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
        <m-loader />
      </div>
    </div>

    <!--  Selected Libraries and Charts    -->
    <div v-else>
      <SelectedLibs
        class="relative w-full mx-auto mt-4 mb-2 lg:w-9/12 xl:w-2/4"
      />

      <!-- Charts -->
      <div class="mb-12">
        <h2>Popularity</h2>
        <div class="grid grid-cols-12 gap-4">
          <template v-if="popularChartsNumber === 1">
            <Stars
              class="col-span-12 md:col-span-8 md:col-start-3 lg:col-span-6 lg:col-start-4"
            />
            <NpmDownloads />
            <GoogleTrends />
            <Stars />
          </template>
          <template v-else-if="popularChartsNumber === 2">
            <NpmDownloads class="col-span-12 md:col-span-6" />
            <GoogleTrends class="col-span-12 md:col-span-6" />
            <Stars class="col-span-12 md:col-span-6" />
            <DevelopersUsage class="col-span-12 md:col-span-6" />
          </template>
          <template v-else>
            <NpmDownloads class="col-span-12 md:col-span-6 xl:col-span-4" />
            <GoogleTrends class="col-span-12 md:col-span-6 xl:col-span-4" />
            <Stars class="col-span-12 md:col-span-6 xl:col-span-4" />
            <DevelopersUsage class="col-span-12 md:col-span-6 xl:col-span-4" />
          </template>
        </div>
      </div>

      <div class="mb-12">
        <h2>Maintenance and Development Activity</h2>
        <div class="grid grid-cols-12 gap-4">
          <Releases class="col-span-12 md:col-span-6 xl:col-span-4" />
          <Contributors class="col-span-12 md:col-span-6 xl:col-span-4" />
          <Commits class="col-span-12 md:col-span-6 xl:col-span-4" />
          <Issues class="col-span-12 md:col-span-6 xl:col-span-4" />
        </div>
      </div>

      <div>
        <h2>Miscellaneous</h2>
        <div class="grid grid-cols-12 gap-4">
          <template v-if="miscChartsNumber === 1">
            <Languages
              class="col-span-12 md:col-span-6 md:col-start-4 xl:col-span-4 xl:col-start-5"
            />
          </template>
          <template v-else-if="miscChartsNumber === 2">
            <Languages
              class="col-span-12 md:col-span-6 xl:col-span-4 xl:col-start-3"
            />
            <TechRadar class="col-span-12 md:col-span-6 xl:col-span-4" />
            <Bundlephobia class="col-span-12 md:col-span-6 xl:col-span-4" />
          </template>
          <template v-else>
            <TechRadar class="col-span-12 md:col-span-6 xl:col-span-4" />
            <Bundlephobia class="col-span-12 md:col-span-6 xl:col-span-4" />
            <Languages class="col-span-12 md:col-span-6 xl:col-span-4" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watchEffect, computed } from 'vue';
import NpmDownloads from './NpmDownloads.vue';
import Releases from './Releases.vue';
import Search from './search/Search.vue';
import Suggestions from './Suggestions.vue';
import TechRadar from './TechRadar.vue';
import GoogleTrends from './google-trends/GTrends.vue';
import Stars from './github-stars/Stars.vue';
import Bundlephobia from './Bundlephobia.vue';
import Issues from './Issues.vue';
import Popular from './Popular.vue';
import SelectedLibs from './SelectedLibs.vue';
import Languages from './Languages.vue';
import Contributors from './Contributors.vue';
import DevelopersUsage from './developer-usage/DevelopersUsage.vue';
import Commits from './Commits.vue';
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
  libraries,
  librariesIds,
  addLibraryByNpmPackage,
  addLibraryByRepo,
} from '@/store/libraries';
import { LibraryT } from '@/libraryApis';

export default defineComponent({
  name: 'Main',
  components: {
    Popular,
    Search,
    Suggestions,

    Bundlephobia,
    Stars,
    Commits,
    Contributors,
    DevelopersUsage,
    GoogleTrends,
    Issues,
    Languages,
    NpmDownloads,
    Releases,
    SelectedLibs,
    TechRadar,
  },

  setup() {
    // Do not allow Google index pages with >3 libraries in comparison
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
        updateUrl(libraries as LibraryT[]);
        updateTitle(libraries as LibraryT[]);
        updateMetaDescription(libraries as LibraryT[]);
      });
    });

    function selectNpmPackage(npmPackageName: string): void {
      addLibraryByNpmPackage(npmPackageName).catch(() => {
        showErrorMsg(`Sorry, we couldn't fetch data for ${npmPackageName}`);
        return Promise.reject();
      });
    }

    function selectRepo(repoId: string): void {
      addLibraryByRepo(repoId).catch(() => {
        showErrorMsg(`Sorry, we couldn't fetch data for ${repoId}`);
        return Promise.reject();
      });
    }

    return {
      libraries,
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
    };
  },
});
</script>
