<template>
  <div>
    <div
      v-show="!isLoadingDefaultLibs"
      class="w-full mx-auto lg:w-9/12 xl:w-2/4"
    >
      <Autosuggest
        @select="select"
        @error="autosuggestApiError = true"
        @success="autosuggestApiError = false"
      />

      <div
        v-if="autosuggestApiError"
        class="my-4 text-xl font-medium text-red-600"
      >
        Oopsie, it looks like we have problems with the underlying suggestions
        api. We are investigating the problem
      </div>

      <!--  Selected libs  -->
      <div
        v-if="selectedLibs.length"
        class="relative mt-4 mb-2 divide-y divide-gray-200"
      >
        <Loader v-if="isFetchingSelectedLib" />
        <div
          v-for="lib in selectedLibs"
          :key="lib.name"
          class="flex items-center justify-between px-3 py-1 hover:bg-gray-50"
        >
          <div class="flex flex-col">
            <div class="font-mono text-base text-gray-800">
              {{ lib.name }}
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
    </div>

    <Popular v-if="!selectedLibs.length" />

    <div v-else>
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
          style="350px"
          :libs="selectedLibs"
          class="col-span-12 md:col-span-6 xl:col-span-3"
        />

        <Stars
          :libs="librariesNames"
          :repos="githubRepositories"
          :is-loading="githubIsLoading"
          :is-error="githubIsError"
          class="col-span-12 md:col-span-6 xl:col-span-3"
        />

        <!-- Age, years -->
        <div class="chart col-span-12 md:col-span-6 xl:col-span-3">
          <div v-if="githubIsLoading" class="text-center p">Loading...</div>
          <Age v-else :libs="librariesNames" :repos="githubRepositories" />
        </div>

        <!-- Issues, count  -->
        <div class="chart col-span-12 md:col-span-6 xl:col-span-3">
          <div v-if="githubIsLoading" class="text-center p">Loading...</div>
          <OpenClosedIssues
            v-else
            :libs="librariesNames"
            :repos="githubRepositories"
          />
        </div>

        <!-- Vulnerabilities -->
        <div class="chart col-span-12 md:col-span-6 xl:col-span-3">
          <div v-if="githubIsLoading" class="text-center p">Loading...</div>
          <Vulnerabilities
            v-else
            :libs="librariesNames"
            :repos="githubRepositories"
          />
        </div>
      </div>
    </div>

    <!-- <Github :libs="selectedLibs" /> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue';
import Github from './Github.vue';
import Npm from './Npm.vue';
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
    Github,
    Npm,
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
    const autosuggestApiError = ref(false);
    const isLoadingDefaultLibs = ref(true);
    const librariesNames = computed<string[]>(() =>
      selectedLibs.value.map((lib) => lib.name)
    );
    const libToColorMap = computed<Record<string, string>>(() =>
      getLibToColorMap(librariesNames.value)
    );
    const isFetchingSelectedLib = ref(false);
    const gh = useGithub(selectedLibs);

    onMounted(() => {
      loadDefaultLibs().then((libs): void => {
        selectedLibs.value = libs;
        isLoadingDefaultLibs.value = false;
      });
    });

    return {
      selectedLibs,
      librariesNames,
      isLoadingDefaultLibs,
      libToColorMap,
      isFetchingSelectedLib,
      autosuggestApiError,
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

        isFetchingSelectedLib.value = true;

        fetchNpmPackage(lib.name).then((npmPackage): void => {
          isFetchingSelectedLib.value = false;
          selectedLibs.value = [...selectedLibs.value, npmPackage as LibraryT];
        });

        updateUrl([...librariesNames.value, lib.name]);
      },
    };
  },
});
</script>

<style lang="postcss" scoped>
.chart-illustration {
  @apply hidden;
}
@screen sm {
  .chart-illustration {
    width: 500px;
    @apply block mt-10 mx-auto;
  }
}
</style>
