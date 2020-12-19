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

      <!--  Selected libs  -->
      <div>
        <jd-chip
          v-for="lib in librariesNames"
          :key="lib"
          selected
          @toggle="deselect(lib)"
          >{{ lib }}</jd-chip
        >
      </div>

      <div
        v-if="autosuggestApiError"
        class="my-4 text-xl font-medium text-red-600"
      >
        Oopsie, it looks like we have problems with the underlying suggestions
        api. We are investigating the problem
      </div>
    </div>

    <div v-if="selectedLibs.length">
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
import Vue from 'vue';
import Npm from './Npm.vue';
import Github from './Github.vue';
import Autosuggest from './Autosuggest.vue';
import TechRadar from './TechRadar.vue';
import GoogleTrends from './GTrends.vue';
import Bundlephobia from './Bundlephobia.vue';
import { LibraryT } from '../apis';
import { loadDefaultLibs, updateUrl } from '../utils';
import { getLibToColorMap } from '../colors';

export default Vue.extend({
  name: 'Main',
  components: {
    Autosuggest,
    Github,
    Npm,
    TechRadar,
    GoogleTrends,
    Bundlephobia,
  },

  data() {
    return {
      selectedLibs: [] as LibraryT[],
      isLoadingDefaultLibs: true,
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
    select(lib: LibraryT): void {
      if (this.librariesNames.includes(lib.name)) {
        return;
      }
      this.selectedLibs.push(lib);
      updateUrl(this.librariesNames);
    },
    deselect(libName: string): void {
      this.selectedLibs = this.selectedLibs.filter(
        (lib) => lib.name !== libName
      );
      updateUrl(this.librariesNames);
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
