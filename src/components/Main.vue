<template>
  <div>
    <Autosuggest class="w-full mx-auto lg:w-9/12 xl:w-2/4" @select="select" />

    <!--  Suggestions    -->
    <!-- <div class="w&#45;full px&#45;3 mx&#45;auto lg:w&#45;9/12 xl:w&#45;2/4"> -->
    <!--   <a -->
    <!--     v&#45;for="sugestedLib in suggestions" -->
    <!--     :key="sugestedLib" -->
    <!--     class="inline&#45;block mt&#45;2 mr&#45;3 text&#45;base text&#45;gray&#45;500 no&#45;underline hover:text&#45;gray&#45;700" -->
    <!--     :href="getHrefForAdditionalLib(sugestedLib)" -->
    <!--     @click.prevent="select(sugestedLib)" -->
    <!--     >+ {{ sugestedLib }}</a -->
    <!--   > -->
    <!-- </div> -->

    <!-- <div -->
    <!--   v&#45;if="errorFetchingNewLib" -->
    <!--   class="w&#45;full px&#45;3 mx&#45;auto mt&#45;2 text&#45;red&#45;500 lg:w&#45;9/12 xl:w&#45;2/4" -->
    <!-- > -->
    <!--   {{ errorFetchingNewLib }} -->
    <!-- </div> -->

    <!--  Show Popular Suggestions    -->
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
          <!-- <NpmDownloads -->
          <!--   :packages&#45;names="packagesNames" -->
          <!--   :is&#45;loading&#45;packages&#45;data="isLoadingPackagesData" -->
          <!--   class="col&#45;span&#45;12 xl:col&#45;span&#45;6" -->
          <!-- /> -->

          <!-- <GoogleTrends -->
          <!--   :is&#45;loading&#45;packages&#45;data="isLoadingPackagesData" -->
          <!--   class="col&#45;span&#45;12 xl:col&#45;span&#45;6" -->
          <!-- /> -->

          <!-- <TechRadar -->
          <!--   v&#45;if="false" -->
          <!--   :libs&#45;names="packagesNames" -->
          <!--   :lib&#45;to&#45;color&#45;map="repoToColorMap" -->
          <!--   class="col&#45;span&#45;12 md:col&#45;span&#45;6 xl:col&#45;span&#45;3" -->
          <!-- /> -->
          <!--  -->
          <!-- <Contributors -->
          <!--   v&#45;if="false" -->
          <!--   :libs="selectedLibs" -->
          <!--   :lib&#45;to&#45;color&#45;map="repoToColorMap" -->
          <!--   :is&#45;loading&#45;libs&#45;data="isLoadingPackagesData" -->
          <!--   class="col&#45;span&#45;12 md:col&#45;span&#45;6 xl:col&#45;span&#45;3" -->
          <!-- /> -->
          <!--  -->
          <!-- <Releases -->
          <!--   v&#45;if="false" -->
          <!--   :libs&#45;names="packagesNames" -->
          <!--   :lib&#45;to&#45;color&#45;map="repoToColorMap" -->
          <!--   :is&#45;loading&#45;libs&#45;data="isLoadingPackagesData" -->
          <!--   class="col&#45;span&#45;12 md:col&#45;span&#45;6 xl:col&#45;span&#45;3" -->
          <!-- /> -->
          <!--  -->
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
// import NpmDownloads from './NpmDownloads.vue';
// import Releases from './Releases.vue';
import Autosuggest from './Autosuggest.vue';
// import TechRadar from './TechRadar.vue';
// import GoogleTrends from './GTrends.vue';
// import Bundlephobia from './Bundlephobia.vue';
// import Issues from './Issues.vue';
import Popular from './Popular.vue';
import SelectedLibs from './SelectedLibs.vue';
// import Languages from './Languages.vue';
// import Contributors from './Contributors.vue';
// import DevelopersUsage from './DevelopersUsage.vue';
// import Commits from './Commits.vue';
// import { ERROR_CODE_NO_GITHUB_DATA } from '@/constants';
// import { NpmPackageT, RepoT } from '@/libraryApis';
import {
  // loadDefaultLibs,
  updateUrl,
  // cleanupUrl,
  // updateTitle,
  // updateMetaDescription,
  // numbersFormatter,
  // getSuggestions,
  // constructHref,
  getNpmPackagesFromUrl,
  showErrorMsg,
} from '../utils';
// import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
// import useGithub from '@/composables/useGithub';
import { updateLibrariesColors } from '@/store/librariesColors';
import {
  // reposIds,
  isLoading,
  libraries,
  librariesIds,
  addLibraryByNpmPackage,
  npmPackagesNames,
} from '@/store/libraries';

export default defineComponent({
  name: 'Main',
  components: {
    Autosuggest,
    SelectedLibs,
    // NpmDownloads,
    // Releases,
    // TechRadar,
    // GoogleTrends,
    // Bundlephobia,
    // Issues,
    Popular,
    // Languages,
    // Commits,
    // Contributors,
    // DevelopersUsage,
  },

  setup() {
    // const selectedLibs = ref<NpmPackageT[]>([]);
    // const errorFetchingNewLib = ref<string | null>(null);
    // const loadingLibs = ref<string[]>([]); // Track libs currently being loading
    // const isLoadingPackagesData = ref(true);
    // const packagesNames = computed<string[]>(() =>
    //   selectedLibs.value.map((lib) => lib.name)
    // );
    // const reposNames = computed<string[]>(() =>
    //   selectedLibs.value.map((lib) => lib.repoName)
    // );
    // const suggestions = computed<string[]>(() =>
    //   getSuggestions(packagesNames.value)
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

      watchEffect(() => !isLoading.value && updateUrl(npmPackagesNames.value));
    });

    // Update url and title
    // watch([selectedLibs], () => {
    //   updateUrl(packagesNames.value);
    //   updateTitle();
    // });

    // Update meta description
    // watch([gh.isLoading, gh.repositories, gh.isError], () => {
    //   const repos = gh.repositories.value;
    //   const hasAnyRepoError = repos.includes(null);
    //
    //   if (gh.isLoading.value || gh.isError.value || hasAnyRepoError) {
    //     updateMetaDescription([]);
    //     return;
    //   }
    //
    //   const data = selectedLibs.value.map((lib, libIndex) => ({
    //     name: lib.name,
    //     description: lib.description,
    //     starsCount: numbersFormatter.format((repos[libIndex] as RepoT).stars),
    //     age: formatDistanceToNowStrict(
    //       new Date((repos[libIndex] as RepoT).createdAt)
    //     ),
    //     vulnerabilitiesCount: (repos[libIndex] as RepoT).vulnerabilitiesCount,
    //     dependenciesCount: lib.dependencies.length,
    //     license: lib.license,
    //   }));
    //
    //   updateMetaDescription(data);
    // });

    function selectNpmPackage(npmPackageName: string): void {
      // errorFetchingNewLib.value = null;

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
      // suggestions,
      // isLoadingPackagesData,
      // errorFetchingNewLib,
      // githubIsError: gh.isError,
      // githubIsLoading: gh.isLoading,
      // githubRepositories: gh.repositories,
      select: selectNpmPackage,
      selectMultiple(npmPackagesNames: string[]): void {
        npmPackagesNames.forEach(selectNpmPackage);
      },
      // getHrefForAdditionalLib(lib: string): string {
      //   return constructHref([...packagesNames.value, lib]);
      // },
    };
  },
});
</script>
