<template>
  <div>
    <Autosuggest class="w-full mx-auto lg:w-9/12 xl:w-2/4" @select="select" />
    <Suggestions @select="select" />

    <!--  Popular Comparisons    -->
    <div v-if="!libraries.length">
      <Popular v-if="!isLoading" @select="selectMultiple" />

      <div
        v-else
        class="relative w-full mx-auto bg-yellow-600 lg:w-9/12 xl:w-2/4 bg-opacity-5"
        style="min-height: 200px"
      >
        <m-loader />
      </div>
    </div>

    <!--  Selected Libraries and Charts    -->
    <div v-else>
      <SelectedLibs
        class="relative w-full mx-auto mt-4 mb-2 lg:w-9/12 xl:w-2/4 divide-y divide-yellow-600 divide-opacity-40"
      />

      <!-- Charts -->
      <div>
        <div class="grid grid-cols-12 gap-4">
          <NpmDownloads class="col-span-12 xl:col-span-6" />
          <GoogleTrends class="col-span-12 xl:col-span-6" />
          <TechRadar class="col-span-12 md:col-span-6 xl:col-span-3" />
          <Releases class="col-span-12 md:col-span-6 xl:col-span-3" />
          <Contributors class="col-span-12 md:col-span-6 xl:col-span-3" />
          <Commits class="col-span-12 md:col-span-6 xl:col-span-3" />
          <DevelopersUsage class="col-span-12 md:col-span-6 xl:col-span-3" />
          <Issues class="col-span-12 md:col-span-6 xl:col-span-3" />
          <Bundlephobia class="col-span-12 md:col-span-6 xl:col-span-3" />
          <Languages class="col-span-12 md:col-span-6 xl:col-span-3" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watchEffect } from 'vue';
import NpmDownloads from './NpmDownloads.vue';
import Releases from './Releases.vue';
import Autosuggest from './Autosuggest.vue';
import Suggestions from './Suggestions.vue';
import TechRadar from './TechRadar.vue';
import GoogleTrends from './GTrends.vue';
import Bundlephobia from './Bundlephobia.vue';
import Issues from './Issues.vue';
import Popular from './Popular.vue';
import SelectedLibs from './SelectedLibs.vue';
import Languages from './Languages.vue';
import Contributors from './Contributors.vue';
import DevelopersUsage from './developer-usage/DevelopersUsage.vue';
import Commits from './Commits.vue';
import {
  updateUrl,
  getTitle,
  getMetaDescription,
  getNpmPackagesFromUrl,
  showErrorMsg,
} from '@/utils';
import { updateLibrariesColors } from '@/store/librariesColors';
import {
  reposIds,
  isLoading,
  libraries,
  librariesIds,
  addLibraryByNpmPackage,
  npmPackagesNames,
} from '@/store/libraries';
import { LibraryT } from '@/libraryApis';

export default defineComponent({
  name: 'Main',
  components: {
    Autosuggest,
    Bundlephobia,
    Commits,
    Contributors,
    DevelopersUsage,
    GoogleTrends,
    Issues,
    Languages,
    NpmDownloads,
    Popular,
    Releases,
    Suggestions,
    SelectedLibs,
    TechRadar,
  },

  setup() {
    watchEffect(() => updateLibrariesColors(librariesIds.value));

    onMounted(() => {
      const npmPackagesNamesFromUrl = getNpmPackagesFromUrl();

      Promise.all(npmPackagesNamesFromUrl.map(addLibraryByNpmPackage)).catch(
        () => {
          // Redirect a user to 404 if there was a wrong lib in the url
          // This is needed for SEO - Google should not crawl "bad" pages
          window.location.href = '/not-found';
        }
      );

      watchEffect(() => {
        if (isLoading.value) {
          return;
        }

        // Update URL
        updateUrl(npmPackagesNames.value);

        // Update Document Title to make it SEO friendly
        window.document.title = getTitle(reposIds.value);

        // Update Meta Description
        (document.querySelector(
          'meta[name="Description"]'
        ) as HTMLElement).setAttribute(
          'content',
          getMetaDescription(libraries as LibraryT[])
        );
      });
    });

    function selectNpmPackage(npmPackageName: string): void {
      addLibraryByNpmPackage(npmPackageName).catch(() => {
        showErrorMsg(`Sorry, we couldn't fetch data for ${npmPackageName}`);
        return Promise.reject();
      });
    }

    return {
      libraries,
      isLoading,
      select: selectNpmPackage,
      selectMultiple(npmPackagesNames: string[]): void {
        npmPackagesNames.forEach(selectNpmPackage);
      },
    };
  },
});
</script>
