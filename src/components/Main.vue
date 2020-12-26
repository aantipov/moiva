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
          class="col-span-12 xl:col-span-8"
        />

        <Bundlephobia
          :libs="librariesNames"
          class="col-span-12 xl:col-span-4"
        />
      </div>

      <div class="grid grid-cols-12 gap-4">
        <GoogleTrends
          :libs="librariesNames"
          :lib-to-color-map="libToColorMap"
          class="col-span-12 xl:col-span-8"
        />

        <TechRadar
          :libs="librariesNames"
          :lib-to-color-map="libToColorMap"
          class="col-span-12 xl:col-span-4"
        />
      </div>

      <Github :libs="selectedLibs" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Github from './Github.vue';
import Npm from './Npm.vue';
import Autosuggest from './Autosuggest.vue';
import TechRadar from './TechRadar.vue';
import GoogleTrends from './GTrends.vue';
import Bundlephobia from './Bundlephobia.vue';
import GithubIcon from './icons/Github.vue';
import Popular from './Popular.vue';
import Loader from './Loader.vue';
import NpmIcon from './icons/Npm.vue';
import { LibraryT, SuggestionT, fetchNpmPackage } from '../apis';
import { loadDefaultLibs, updateUrl } from '../utils';
import { getLibToColorMap } from '../colors';

export default defineComponent({
  name: 'Main',
  components: {
    Autosuggest,
    Github,
    Npm,
    TechRadar,
    GoogleTrends,
    Bundlephobia,
    GithubIcon,
    NpmIcon,
    Loader,
    Popular,
  },

  data() {
    return {
      selectedLibs: [] as LibraryT[],
      isLoadingDefaultLibs: true,
      isFetchingSelectedLib: false,
      autosuggestApiError: false,
    };
  },

  computed: {
    libToColorMap(): Record<string, string> {
      return getLibToColorMap(this.librariesNames);
    },

    librariesNames(): string[] {
      return this.selectedLibs.map((lib) => lib.name);
    },
  },

  mounted(): void {
    loadDefaultLibs().then((libs): LibraryT[] => {
      this.selectedLibs = libs;
      this.isLoadingDefaultLibs = false;
      return libs;
    });
  },

  methods: {
    select(lib: SuggestionT): void {
      if (this.librariesNames.includes(lib.name)) {
        return;
      }

      this.isFetchingSelectedLib = true;

      fetchNpmPackage(lib.name).then((npmPackage): void => {
        this.isFetchingSelectedLib = false;
        this.selectedLibs = [...this.selectedLibs, npmPackage as LibraryT];
      });

      updateUrl([...this.librariesNames, lib.name]);
    },
    deselect(libName: string): void {
      this.selectedLibs = this.selectedLibs.filter(
        (lib) => lib.name !== libName
      );
      updateUrl(this.librariesNames);
    },
    getNpmLink(libName: string): string {
      return `https://www.npmjs.com/package/${encodeURIComponent(libName)}`;
    },
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
