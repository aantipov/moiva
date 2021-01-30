<template>
  <div>
    <Autosuggest class="w-full mx-auto lg:w-9/12 xl:w-2/4" @select="select" />

    <Suggestions @select="select" />

    <!--  Show Popular Comparisons    -->
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

    <!--  Show Selected Libraries and Charts    -->
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

          <Contributors class="col-span-12 md:col-span-6 xl:col-span-3" />

          <Releases class="col-span-12 md:col-span-6 xl:col-span-3" />

          <!-- <Commits -->
          <!--   v&#45;if="false" -->
          <!--   :libs="selectedLibs" -->
          <!--   :lib&#45;to&#45;color&#45;map="repoToColorMap" -->
          <!--   :is&#45;loading&#45;libs&#45;data="isLoadingPackagesData" -->
          <!--   class="col&#45;span&#45;12 md:col&#45;span&#45;6 xl:col&#45;span&#45;3" -->
          <!-- /> -->
          <!--  -->
          <!-- <DevelopersUsage -->
          <!--   v&#45;if="false" -->
          <!--   :libs&#45;names="packagesNames" -->
          <!--   :lib&#45;to&#45;color&#45;map="repoToColorMap" -->
          <!--   :is&#45;loading&#45;libs&#45;data="isLoadingPackagesData" -->
          <!--   class="col&#45;span&#45;12 md:col&#45;span&#45;6 xl:col&#45;span&#45;3" -->
          <!-- /> -->
          <!--  -->
          <!-- <Issues -->
          <!--   v&#45;if="false" -->
          <!--   :repos&#45;names="reposNames" -->
          <!--   :repos="githubRepositories" -->
          <!--   :is&#45;loading="githubIsLoading" -->
          <!--   :is&#45;loading&#45;libs&#45;data="isLoadingPackagesData" -->
          <!--   :is&#45;error="githubIsError" -->
          <!--   class="col&#45;span&#45;12 md:col&#45;span&#45;6 xl:col&#45;span&#45;3" -->
          <!-- /> -->
          <!--  -->
          <!-- <Bundlephobia -->
          <!--   v&#45;if="false" -->
          <!--   :libs&#45;names="packagesNames" -->
          <!--   :is&#45;loading&#45;libs&#45;data="isLoadingPackagesData" -->
          <!--   class="col&#45;span&#45;12 md:col&#45;span&#45;6 xl:col&#45;span&#45;3" -->
          <!-- /> -->
          <!--  -->
          <!-- <Languages -->
          <!--   v&#45;if="false" -->
          <!--   :libs="selectedLibs" -->
          <!--   :is&#45;loading&#45;libs&#45;data="isLoadingPackagesData" -->
          <!--   class="col&#45;span&#45;12 md:col&#45;span&#45;6 xl:col&#45;span&#45;3" -->
          <!-- /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  // ref,
  // computed,
  // watch,
  watchEffect,
} from 'vue';
import NpmDownloads from './NpmDownloads.vue';
import Releases from './Releases.vue';
import Autosuggest from './Autosuggest.vue';
import Suggestions from './Suggestions.vue';
import TechRadar from './TechRadar.vue';
import GoogleTrends from './GTrends.vue';
// import Bundlephobia from './Bundlephobia.vue';
// import Issues from './Issues.vue';
import Popular from './Popular.vue';
import SelectedLibs from './SelectedLibs.vue';
// import Languages from './Languages.vue';
import Contributors from './Contributors.vue';
// import DevelopersUsage from './DevelopersUsage.vue';
// import Commits from './Commits.vue';
// import { ERROR_CODE_NO_GITHUB_DATA } from '@/constants';
// import { NpmPackageT, RepoT } from '@/libraryApis';
import {
  // loadDefaultLibs,
  updateUrl,
  // cleanupUrl,
  getTitle,
  getMetaDescription,
  // numbersFormatter,
  // constructHref,
  getNpmPackagesFromUrl,
  showErrorMsg,
} from '@/utils';
// import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
// import useGithub from '@/composables/useGithub';
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
    Contributors,
    GoogleTrends,
    NpmDownloads,
    Popular,
    Releases,
    Suggestions,
    SelectedLibs,
    TechRadar,
    // Bundlephobia,
    // Issues,
    // Languages,
    // Commits,
    // DevelopersUsage,
  },

  setup() {
    // const selectedLibs = ref<NpmPackageT[]>([]);
    // const loadingLibs = ref<string[]>([]); // Track libs currently being loading
    // const isLoadingPackagesData = ref(true);
    // const packagesNames = computed<string[]>(() =>
    //   selectedLibs.value.map((lib) => lib.name)
    // );
    // const reposNames = computed<string[]>(() =>
    //   selectedLibs.value.map((lib) => lib.repoName)
    // );

    watchEffect(() => updateLibrariesColors(librariesIds.value));

    // const gh = useGithub(selectedLibs);

    onMounted(() => {
      const npmPackagesNamesFromUrl = getNpmPackagesFromUrl();

      Promise.all(
        npmPackagesNamesFromUrl.map((pkgName) =>
          addLibraryByNpmPackage(pkgName)
        )
      ).catch(() => {
        // // Redirect a user to 404 if there was a wrong lib in the url
        // // This is needed for SEO - Google should not crawl "bad" pages
        window.location.href = '/not-found';
      });

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
      // packagesNames,
      // reposNames,
      // isLoadingPackagesData,
      // githubIsError: gh.isError,
      // githubIsLoading: gh.isLoading,
      // githubRepositories: gh.repositories,
      select: selectNpmPackage,
      selectMultiple(npmPackagesNames: string[]): void {
        npmPackagesNames.forEach(selectNpmPackage);
      },
    };
  },
});
</script>
