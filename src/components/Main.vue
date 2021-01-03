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
          v-for="(lib, libIndex) in selectedLibs"
          :key="lib.name"
          class="flex items-center justify-between px-3 py-1 hover:bg-gray-50"
        >
          <div class="flex flex-col flex-grow">
            <div class="text-base text-gray-800">
              <!-- Name -->
              <span class="font-mono">
                <span>{{ lib.name }}</span>
                <span class="text-gray-500">@{{ lib.version }}</span>
              </span>
            </div>

            <div class="text-sm text-gray-500">
              <div v-if="githubIsLoading">
                <m-loader-tail-spin v-if="githubIsLoading" />
              </div>

              <div v-else-if="githubIsError" class="text-red-500">
                Error while loading data
              </div>

              <div v-else class="grid grid-cols-12">
                <div class="col-span-12 sm:col-span-3">
                  <span>
                    <span>&#9733;</span>
                    <span>{{ getStars(libIndex) }}</span>
                  </span>

                  <span class="ml-2">{{ getAge(libIndex) }}</span>
                </div>

                <div class="col-span-12 sm:col-span-4">
                  <span
                    >{{
                      githubRepositories[libIndex].vulnerabilitiesCount
                    }}
                    vulnerabilities</span
                  >

                  <m-chart-info class="inline">
                    <p>Both open and closed vulnerabilities are included.</p>
                    <p>
                      <a
                        href="https://github.com/advisories?query=ecosystem%3Anpm"
                        target="_blank"
                        >Github</a
                      >
                      data is used to build the chart.
                    </p>
                    <p>
                      Another good resource to check for vulnerabilities is
                      <a href="https://snyk.io/vuln/?type=npm" target="_blank"
                        >Snyk</a
                      >
                    </p>
                  </m-chart-info>
                </div>

                <div class="col-span-12 sm:col-span-4">
                  {{ lib.dependencies.length }} dependencies
                </div>
              </div>
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
import { defineComponent, onMounted, ref, computed } from 'vue';
import Npm from './Npm.vue';
import NpmVersions from './NpmVersions.vue';
import Autosuggest from './Autosuggest.vue';
import TechRadar from './TechRadar.vue';
import GoogleTrends from './GTrends.vue';
import Bundlephobia from './Bundlephobia.vue';
import GithubIcon from './icons/Github.vue';
import OpenClosedIssues from './GithubOpenClosedIssues.vue';
import Popular from './Popular.vue';
import Loader from './Loader.vue';
import Languages from './Languages.vue';
import NpmIcon from './icons/Npm.vue';
import { LibraryT, SuggestionT, fetchNpmPackage } from '../apis';
import { loadDefaultLibs, updateUrl, numbersFormatter } from '../utils';
import { getLibToColorMap } from '../colors';
import useGithub from '@/composables/useGithub';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';

export default defineComponent({
  name: 'Main',
  components: {
    Autosuggest,
    Npm,
    NpmVersions,
    TechRadar,
    GoogleTrends,
    Bundlephobia,
    OpenClosedIssues,
    GithubIcon,
    NpmIcon,
    Loader,
    Popular,
    Languages,
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
      getStars(libIndex: number): null | string {
        return !gh.isLoading.value && !gh.isError.value
          ? numbersFormatter.format(gh.repositories.value[libIndex].stars)
          : null;
      },
      getAge(libIndex: number): string {
        const date = gh.repositories.value[libIndex].createdAt;

        return formatDistanceToNowStrict(new Date(date));
      },
    };
  },
});
</script>
