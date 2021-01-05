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

    <div v-if="!selectedLibs.length">
      <Popular v-if="!isLoadingLibsData" @select="selectMultiple" />

      <div
        v-else
        class="relative w-full mx-auto lg:w-9/12 xl:w-2/4"
        style="min-height: 200px"
      >
        <Loader />
      </div>
    </div>

    <div v-else>
      <SelectedLibs
        class="relative w-full mx-auto mt-4 mb-2 lg:w-9/12 xl:w-2/4 divide-y divide-gray-200"
        :is-loading="isLoadingLibsData"
        :libs="selectedLibs"
        :github-is-loading="githubIsLoading"
        :github-is-error="githubIsError"
        :github-repos="githubRepositories"
        @deselect="deselect"
      />

      <!-- Charts -->
      <div>
        <div class="grid grid-cols-12 gap-4">
          <Npm
            :libs="librariesNames"
            :lib-to-color-map="libToColorMap"
            class="col-span-12 xl:col-span-6"
          />

          <GoogleTrends
            :libs="librariesNames"
            :lib-to-color-map="libToColorMap"
            class="col-span-12 xl:col-span-6"
          />

          <TechRadar
            :libs="librariesNames"
            :lib-to-color-map="libToColorMap"
            class="col-span-12 md:col-span-6 xl:col-span-3"
          />

          <Bundlephobia
            :libs="librariesNames"
            class="col-span-12 md:col-span-6 xl:col-span-3"
          />

          <NpmVersions
            :libs="librariesNames"
            :lib-to-color-map="libToColorMap"
            class="col-span-12 md:col-span-6 xl:col-span-3"
          />

          <Languages
            :libs="selectedLibs"
            class="col-span-12 md:col-span-6 xl:col-span-3"
          />

          <OpenClosedIssues
            :libs="librariesNames"
            :repos="githubRepositories"
            :is-loading="githubIsLoading"
            :is-error="githubIsError"
            class="col-span-12 md:col-span-6 xl:col-span-3"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed, watch } from 'vue';
import Npm from './Npm.vue';
import NpmVersions from './NpmVersions.vue';
import Autosuggest from './Autosuggest.vue';
import TechRadar from './TechRadar.vue';
import GoogleTrends from './GTrends.vue';
import Bundlephobia from './Bundlephobia.vue';
import OpenClosedIssues from './GithubOpenClosedIssues.vue';
import Popular from './Popular.vue';
import SelectedLibs from './SelectedLibs.vue';
import Loader from './Loader.vue';
import Languages from './Languages.vue';
import { LibraryT, fetchNpmPackage } from '../apis';
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
import { getLibToColorMap } from '../colors';
import useGithub from '@/composables/useGithub';

export default defineComponent({
  name: 'Main',
  components: {
    Loader,
    Autosuggest,
    SelectedLibs,
    Npm,
    NpmVersions,
    TechRadar,
    GoogleTrends,
    Bundlephobia,
    OpenClosedIssues,
    Popular,
    Languages,
  },

  setup() {
    const selectedLibs = ref<LibraryT[]>([]);
    const loadingLibs = ref<string[]>([]); // Track libs currently being loading
    const isLoadingLibsData = ref(true);
    const librariesNames = computed<string[]>(() =>
      selectedLibs.value.map((lib) => lib.name)
    );
    const suggestions = computed<string[]>(() =>
      getSuggestions(librariesNames.value)
    );
    const libToColorMap = computed<Record<string, string>>(() =>
      getLibToColorMap(librariesNames.value)
    );
    const gh = useGithub(selectedLibs);

    onMounted(() => {
      loadDefaultLibs().then((libs): void => {
        selectedLibs.value = libs;
        isLoadingLibsData.value = false;
      });
    });

    // Update url and title
    watch([selectedLibs], () => {
      updateUrl(librariesNames.value);
      updateTitle();
    });

    // Update meta description
    watch([gh.isLoading, gh.repositories, gh.isError], () => {
      const repos = gh.repositories.value;

      if (gh.isLoading.value || gh.isError.value) {
        updateMetaDescription([]);
        return;
      }

      const data = selectedLibs.value.map((lib, index) => ({
        name: lib.name,
        description: lib.description,
        starsCount: numbersFormatter.format(repos[index].stars),
        age: formatDistanceToNowStrict(new Date(repos[index].createdAt)),
        vulnerabilitiesCount: repos[index].vulnerabilitiesCount,
        dependenciesCount: lib.dependencies.length,
        license: lib.license,
      }));

      updateMetaDescription(data);
    });

    return {
      selectedLibs,
      librariesNames,
      suggestions,
      isLoadingLibsData,
      libToColorMap,
      githubIsError: gh.isError,
      githubIsLoading: gh.isLoading,
      githubRepositories: gh.repositories,
      deselect(libName: string): void {
        selectedLibs.value = selectedLibs.value.filter(
          (lib) => lib.name !== libName
        );
      },
      select(libName: string): void {
        if (
          !libName ||
          librariesNames.value.includes(libName) ||
          loadingLibs.value.includes(libName)
        ) {
          return;
        }

        isLoadingLibsData.value = true;
        loadingLibs.value = [...loadingLibs.value, libName];

        fetchNpmPackage(libName)
          .then((npmPackage): void => {
            selectedLibs.value = [
              ...selectedLibs.value,
              npmPackage as LibraryT,
            ];
          })
          .finally(() => {
            isLoadingLibsData.value = false;
            loadingLibs.value = loadingLibs.value.filter(
              (val) => libName !== val
            );
          });
      },
      selectMultiple(libNames: string[]): void {
        // Assumption - it's called from the Start Page
        // when there is no selected libraries yes
        isLoadingLibsData.value = true;
        loadingLibs.value = [...libNames];

        Promise.all(libNames.map(fetchNpmPackage))
          .then((npmPackages): void => {
            selectedLibs.value = [
              ...selectedLibs.value,
              ...(npmPackages as LibraryT[]),
            ];
          })
          .finally(() => {
            isLoadingLibsData.value = false;
            loadingLibs.value = loadingLibs.value.filter(
              (val) => !libNames.includes(val)
            );
          });
      },
      getHrefForAdditionalLib(lib: string): string {
        return constructHref([...librariesNames.value, lib]);
      },
    };
  },
});
</script>
