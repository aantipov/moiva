<template>
  <div>
    <Autosuggest class="w-full mx-auto lg:w-9/12 xl:w-2/4" @select="select" />

    <!--  Suggestions    -->
    <div class="w-full px-3 mx-auto lg:w-9/12 xl:w-2/4">
      <a
        v-for="sugestedLib in suggestions"
        :key="sugestedLib"
        class="inline-block mt-2 mr-3 text-base text-gray-500 no-underline hover:text-gray-700"
        :href="getHrefForAdditionalLib(sugestedLib)"
        @click.prevent="select(sugestedLib)"
        >+ {{ sugestedLib }}</a
      >
    </div>

    <div
      v-if="errorFetchingNewLib"
      class="w-full px-3 mx-auto mt-2 text-red-500 lg:w-9/12 xl:w-2/4"
    >
      {{ errorFetchingNewLib }}
    </div>

    <div v-if="!selectedLibs.length">
      <Popular v-if="!isLoadingPackagesData" @select="selectMultiple" />

      <div
        v-else
        class="relative w-full mx-auto bg-yellow-600 lg:w-9/12 xl:w-2/4 bg-opacity-5"
        style="min-height: 200px"
      >
        <m-loader />
      </div>
    </div>

    <div v-else>
      <SelectedLibs
        class="relative w-full mx-auto mt-4 mb-2 lg:w-9/12 xl:w-2/4 divide-y divide-yellow-600 divide-opacity-40"
        :libs="selectedLibs"
        :npm-is-loading="isLoadingPackagesData"
        :github-is-loading="githubIsLoading"
        :github-is-error="githubIsError"
        :github-repos="githubRepositories"
        :repo-to-color-map="repoToColorMap"
        @deselect="deselect"
      />

      <!-- Charts -->
      <div>
        <div class="grid grid-cols-12 gap-4">
          <NpmDownloads
            :packages-names="packagesNames"
            :repos-ids="reposIds"
            :is-loading-packages-data="isLoadingPackagesData"
            :repo-to-color-map="repoToColorMap"
            class="col-span-12 xl:col-span-6"
          />

          <GoogleTrends
            :repos-ids="reposIds"
            :is-loading-packages-data="isLoadingPackagesData"
            :repo-to-color-map="repoToColorMap"
            class="col-span-12 xl:col-span-6"
          />

          <TechRadar
            v-if="false"
            :libs-names="packagesNames"
            :lib-to-color-map="repoToColorMap"
            class="col-span-12 md:col-span-6 xl:col-span-3"
          />

          <Contributors
            v-if="false"
            :libs="selectedLibs"
            :lib-to-color-map="repoToColorMap"
            :is-loading-libs-data="isLoadingPackagesData"
            class="col-span-12 md:col-span-6 xl:col-span-3"
          />

          <Releases
            v-if="false"
            :libs-names="packagesNames"
            :lib-to-color-map="repoToColorMap"
            :is-loading-libs-data="isLoadingPackagesData"
            class="col-span-12 md:col-span-6 xl:col-span-3"
          />

          <Commits
            v-if="false"
            :libs="selectedLibs"
            :lib-to-color-map="repoToColorMap"
            :is-loading-libs-data="isLoadingPackagesData"
            class="col-span-12 md:col-span-6 xl:col-span-3"
          />

          <DevelopersUsage
            v-if="false"
            :libs-names="packagesNames"
            :lib-to-color-map="repoToColorMap"
            :is-loading-libs-data="isLoadingPackagesData"
            class="col-span-12 md:col-span-6 xl:col-span-3"
          />

          <Issues
            v-if="false"
            :repos-names="reposNames"
            :repos="githubRepositories"
            :is-loading="githubIsLoading"
            :is-loading-libs-data="isLoadingPackagesData"
            :is-error="githubIsError"
            class="col-span-12 md:col-span-6 xl:col-span-3"
          />

          <Bundlephobia
            v-if="false"
            :libs-names="packagesNames"
            :is-loading-libs-data="isLoadingPackagesData"
            class="col-span-12 md:col-span-6 xl:col-span-3"
          />

          <Languages
            v-if="false"
            :libs="selectedLibs"
            :is-loading-libs-data="isLoadingPackagesData"
            class="col-span-12 md:col-span-6 xl:col-span-3"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed, watch } from 'vue';
import NpmDownloads from './NpmDownloads.vue';
import Releases from './Releases.vue';
import Autosuggest from './Autosuggest.vue';
import TechRadar from './TechRadar.vue';
import GoogleTrends from './GTrends.vue';
import Bundlephobia from './Bundlephobia.vue';
import Issues from './Issues.vue';
import Popular from './Popular.vue';
import SelectedLibs from './SelectedLibs.vue';
import Languages from './Languages.vue';
import Contributors from './Contributors.vue';
import DevelopersUsage from './DevelopersUsage.vue';
import Commits from './Commits.vue';
import { ERROR_CODE_NO_GITHUB_DATA } from '@/constants';
import { LibraryT, fetchNpmPackage, RepoT } from '@/apis';
import {
  loadDefaultLibs,
  updateUrl,
  updateTitle,
  updateMetaDescription,
  numbersFormatter,
  getSuggestions,
  constructHref,
} from '../utils';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import { getRepoToColorMap } from '../colors';
import useGithub from '@/composables/useGithub';

export default defineComponent({
  name: 'Main',
  components: {
    Autosuggest,
    SelectedLibs,
    NpmDownloads,
    Releases,
    TechRadar,
    GoogleTrends,
    Bundlephobia,
    Issues,
    Popular,
    Languages,
    Commits,
    Contributors,
    DevelopersUsage,
  },

  setup() {
    const selectedLibs = ref<LibraryT[]>([]);
    const errorFetchingNewLib = ref<string | null>(null);
    const loadingLibs = ref<string[]>([]); // Track libs currently being loading
    const isLoadingPackagesData = ref(true);
    const packagesNames = computed<string[]>(() =>
      selectedLibs.value.map((lib) => lib.name)
    );
    const reposNames = computed<string[]>(() =>
      selectedLibs.value.map((lib) => lib.repoName)
    );
    const reposIds = computed<string[]>(() =>
      selectedLibs.value.map((lib) => lib.repoId)
    );
    const suggestions = computed<string[]>(() =>
      getSuggestions(packagesNames.value)
    );
    const repoToColorMap = computed<Record<string, string>>(() =>
      getRepoToColorMap(reposIds.value)
    );
    const gh = useGithub(selectedLibs);

    onMounted(() => {
      loadDefaultLibs().then((libs): void => {
        selectedLibs.value = libs;
        isLoadingPackagesData.value = false;
      });
    });

    // Update url and title
    watch([selectedLibs], () => {
      updateUrl(packagesNames.value);
      updateTitle();
    });

    // Update meta description
    watch([gh.isLoading, gh.repositories, gh.isError], () => {
      const repos = gh.repositories.value;
      const hasAnyRepoError = repos.includes(null);

      if (gh.isLoading.value || gh.isError.value || hasAnyRepoError) {
        updateMetaDescription([]);
        return;
      }

      const data = selectedLibs.value.map((lib, libIndex) => ({
        name: lib.name,
        description: lib.description,
        starsCount: numbersFormatter.format((repos[libIndex] as RepoT).stars),
        age: formatDistanceToNowStrict(
          new Date((repos[libIndex] as RepoT).createdAt)
        ),
        vulnerabilitiesCount: (repos[libIndex] as RepoT).vulnerabilitiesCount,
        dependenciesCount: lib.dependencies.length,
        license: lib.license,
      }));

      updateMetaDescription(data);
    });

    return {
      selectedLibs,
      packagesNames,
      reposNames,
      reposIds,
      suggestions,
      isLoadingPackagesData,
      errorFetchingNewLib,
      repoToColorMap,
      githubIsError: gh.isError,
      githubIsLoading: gh.isLoading,
      githubRepositories: gh.repositories,
      deselect(libName: string): void {
        errorFetchingNewLib.value = null;
        selectedLibs.value = selectedLibs.value.filter(
          (lib) => lib.name !== libName
        );
      },
      select(libName: string): void {
        errorFetchingNewLib.value = null;
        if (
          !libName ||
          packagesNames.value.includes(libName) ||
          loadingLibs.value.includes(libName)
        ) {
          return;
        }

        isLoadingPackagesData.value = true;
        loadingLibs.value = [...loadingLibs.value, libName];

        fetchNpmPackage(libName)
          .then((npmPackage): void => {
            selectedLibs.value = [
              ...selectedLibs.value,
              npmPackage as LibraryT,
            ];
          })
          .catch((err) => {
            let errMsg = `Sorry, we couldn't fetch data for ${libName}`;
            if (err === ERROR_CODE_NO_GITHUB_DATA) {
              errMsg += ': the package information doesnt contain GitHub data';
            }
            errorFetchingNewLib.value = errMsg;
          })
          .finally(() => {
            isLoadingPackagesData.value = false;
            loadingLibs.value = loadingLibs.value.filter(
              (val) => libName !== val
            );
          });
      },
      selectMultiple(libNames: string[]): void {
        // Assumption - it's called from the Start Page
        // when there is no selected libraries yet
        errorFetchingNewLib.value = null;
        isLoadingPackagesData.value = true;
        loadingLibs.value = [...libNames];

        Promise.all(libNames.map(fetchNpmPackage))
          .then((npmPackages): void => {
            selectedLibs.value = [
              ...selectedLibs.value,
              ...(npmPackages as LibraryT[]),
            ];
          })
          .finally(() => {
            isLoadingPackagesData.value = false;
            loadingLibs.value = loadingLibs.value.filter(
              (val) => !libNames.includes(val)
            );
          });
      },
      getHrefForAdditionalLib(lib: string): string {
        return constructHref([...packagesNames.value, lib]);
      },
    };
  },
});
</script>
