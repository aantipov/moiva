<template>
  <div>
    <LibsSelectorMobile v-model="selectedLibs" class="block md:hidden" />

    <LibsSelectorDesktop
      v-model="selectedLibs"
      class="hidden mx-auto mt-5 text-center md:block xl:w-2/3"
    />

    <div v-if="selectedLibs.length">
      <div class="grid grid-cols-12 gap-4">
        <Npm :libs="selectedLibs" class="col-span-12 xl:col-span-8" />

        <TechRadar :libs="selectedLibs" class="col-span-12 xl:col-span-4" />
      </div>

      <div class="grid grid-cols-12 gap-4">
        <GoogleTrends :libs="selectedLibs" class="col-span-12 xl:col-span-8" />

        <Bundlephobia :libs="selectedLibs" class="col-span-12 xl:col-span-4" />
      </div>

      <Github :libs="selectedLibs" />
    </div>

    <div v-else class="my-16 text-center p-lead">
      Add libraries to comparison
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Npm from './Npm.vue';
import Github from './Github.vue';
import LibsSelectorMobile from './LibsSelectorMobile.vue';
import LibsSelectorDesktop from './LibsSelectorDesktop.vue';
import TechRadar from './TechRadar.vue';
import GoogleTrends from './GTrends.vue';
import Bundlephobia from './Bundlephobia.vue';
import libsConfigs, { AppConfigT, appsConfigsMap } from '../../apps-config';
import { cleanupUrl } from '../utils';

// Validate URL's 'apps' parameter and remove wrong libs
cleanupUrl();

// Define a default list of libs
const Url = new URL(window.location.href);
const libsFromUrl = Url.searchParams.get('apps')?.split('--') || [];
const defaultSelectedLibs = libsFromUrl.length
  ? libsFromUrl
  : libsConfigs
      .filter((libConfig) => libConfig.selected)
      .map((libConfig) => libConfig.urlname);

function updateUrl(selectedLibs: string[]): void {
  if (!selectedLibs.length) {
    Url.searchParams.delete('apps');
    window.history.replaceState(null, '', Url.href);
    return;
  }

  const selectedLibsUrlnames = selectedLibs.map(
    (lib) => appsConfigsMap[lib].urlname
  );
  Url.searchParams.set('apps', selectedLibsUrlnames.join('--'));
  window.history.replaceState(null, '', Url.href);
}

export default Vue.extend({
  name: 'Main',
  components: {
    Github,
    Npm,
    TechRadar,
    GoogleTrends,
    Bundlephobia,
    LibsSelectorMobile,
    LibsSelectorDesktop,
  },

  data() {
    return {
      selectedLibs: defaultSelectedLibs.map(
        (lib) =>
          (libsConfigs.find(
            (libConfig) => libConfig.urlname === lib
          ) as AppConfigT).name
      ),
    };
  },

  watch: {
    selectedLibs(): void {
      // This is a workaround for a problem of being able to select a category
      // TODO: fix the problem
      const stateManIndex = this.selectedLibs.indexOf('# State Management');
      const testingIndex = this.selectedLibs.indexOf('# Testing');
      const frameworksIndex = this.selectedLibs.indexOf('# Frameworks');
      const foundElementIndex = [
        stateManIndex,
        testingIndex,
        frameworksIndex,
      ].find((i) => i > -1);

      if (foundElementIndex !== undefined) {
        this.selectedLibs.splice(foundElementIndex, 1);
        return;
      }

      updateUrl(this.selectedLibs);
    },
  },
});
</script>
