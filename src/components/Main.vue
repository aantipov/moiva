<template>
  <div>
    <Autosuggest
      class="w-full mx-auto lg:w-9/12 xl:w-2/4"
      :is-loading="isLoadingLibsData"
      @select="select"
    />

    <!--   Pupular comparisons   -->
    <div v-if="!selectedLibs.length">
      <Popular v-if="!isLoadingLibsData" />

      <div
        v-else
        class="relative w-full mx-auto lg:w-9/12 xl:w-2/4"
        style="min-height: 200px"
      >
        <Loader />
      </div>
    </div>

    <div v-else>
      <!--  Selected libs list  -->
      <div
        class="relative w-full mx-auto mt-4 mb-2 lg:w-9/12 xl:w-2/4 divide-y divide-gray-200"
      >
        <Loader v-if="isLoadingLibsData" />
        <div
          v-for="lib in selectedLibs"
          :key="lib.name"
          class="flex items-center justify-between px-3 py-1 hover:bg-gray-50"
        >
          <div class="flex flex-col">
            <div class="font-mono text-base text-gray-800">
              <span>{{ lib.name }}</span>
              <span class="text-gray-500">@{{ lib.version }}</span>
            </div>

            <div class="text-sm text-gray-500">
              {{ lib.description }}
            </div>
          </div>

          <div class="flex items-center ml-2">
            <a
              :href="getNpmLink(lib.name)"
              target="_blank"
              class="hidden mr-4 sm:block"
            >
              <NpmIcon />
            </a>

            <a :href="lib.repo" target="_blank" class="mr-4">
              <GithubIcon />
            </a>

            <m-close @click="deselect(lib.name)" />
          </div>
        </div>
      </div>

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

          <Dependencies
            :libs="selectedLibs"
            class="col-span-12 md:col-span-6 xl:col-span-3"
          />

          <NpmVersions
            :libs="librariesNames"
            :lib-to-color-map="libToColorMap"
            class="col-span-12 md:col-span-6 xl:col-span-3"
          />

          <Stars
            :libs="librariesNames"
            :repos="githubRepositories"
            :is-loading="githubIsLoading"
            :is-error="githubIsError"
            class="col-span-12 md:col-span-6 xl:col-span-3"
          />

          <Age
            :libs="librariesNames"
            :repos="githubRepositories"
            :is-loading="githubIsLoading"
            :is-error="githubIsError"
            class="col-span-12 md:col-span-6 xl:col-span-3"
          />

          <OpenClosedIssues
            :libs="librariesNames"
            :repos="githubRepositories"
            :is-loading="githubIsLoading"
            :is-error="githubIsError"
            class="col-span-12 md:col-span-6 xl:col-span-3"
          />

          <Vulnerabilities
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
import { defineComponent, onMounted, ref, computed } from 'vue';
import Npm from './Npm.vue';
import NpmVersions from './NpmVersions.vue';
import Autosuggest from './Autosuggest.vue';
import TechRadar from './TechRadar.vue';
import GoogleTrends from './GTrends.vue';
import Bundlephobia from './Bundlephobia.vue';
import Dependencies from './Dependencies.vue';
import GithubIcon from './icons/Github.vue';
import OpenClosedIssues from './GithubOpenClosedIssues.vue';
import Age from './GithubAge.vue';
import Stars from './GithubStars.vue';
import Vulnerabilities from './GithubVulnerabilities.vue';
import Popular from './Popular.vue';
import Loader from './Loader.vue';
import NpmIcon from './icons/Npm.vue';
import { LibraryT, SuggestionT, fetchNpmPackage } from '../apis';
import { loadDefaultLibs, updateUrl } from '../utils';
import { getLibToColorMap } from '../colors';
import useGithub from '@/composables/useGithub';

export default defineComponent({
  name: 'Main',
  components: {
    Autosuggest,
    Npm,
    NpmVersions,
    TechRadar,
    GoogleTrends,
    Bundlephobia,
    Dependencies,
    OpenClosedIssues,
    Age,
    Stars,
    Vulnerabilities,
    GithubIcon,
    NpmIcon,
    Loader,
    Popular,
  },

  setup() {
    const selectedLibs = ref<LibraryT[]>([]);
    const isLoadingLibsData = ref(true);
    const librariesNames = computed<string[]>(() =>
      selectedLibs.value.map((lib) => lib.name)
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

    return {
      selectedLibs,
      librariesNames,
      isLoadingLibsData,
      libToColorMap,
      getNpmLink(libName: string): string {
        return `https://www.npmjs.com/package/${encodeURIComponent(libName)}`;
      },
      githubIsError: gh.isError,
      githubIsLoading: gh.isLoading,
      githubRepositories: gh.repositories,
      deselect(libName: string): void {
        selectedLibs.value = selectedLibs.value.filter(
          (lib) => lib.name !== libName
        );
        updateUrl(librariesNames.value);
      },
      select(lib: SuggestionT): void {
        if (librariesNames.value.includes(lib.name)) {
          return;
        }

        isLoadingLibsData.value = true;

        fetchNpmPackage(lib.name).then((npmPackage): void => {
          isLoadingLibsData.value = false;
          selectedLibs.value = [...selectedLibs.value, npmPackage as LibraryT];
        });

        updateUrl([...librariesNames.value, lib.name]);
      },
    };
  },
});
</script>
