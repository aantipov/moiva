<template>
  <div>
    <LibsSelectorMobile v-model="selectedApps" class="block md:hidden" />

    <LibsSelectorDesktop
      v-model="selectedApps"
      class="hidden mx-auto mt-5 text-center md:block xl:w-2/3"
    />

    <div v-if="selectedApps.length">
      <div class="grid grid-cols-12 gap-4">
        <Npm :apps="selectedApps" class="col-span-12 xl:col-span-8" />
        <TechRadar :apps="selectedApps" class="col-span-12 xl:col-span-4" />
      </div>

      <GoogleTrends :apps="selectedApps" />

      <Github :apps="selectedApps" />
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
import configApps, { AppConfigT, appsConfigsMap } from '../../apps-config';

// Define a default list of apps and fix the url if wrong apps are passed
const Url = new URL(window.location.href);
const appsUrlParam = Url.searchParams.get('apps');
const appsFromUrl = appsUrlParam?.split('--') || [];
const appsFromUrlValidated = appsFromUrl.filter(
  (urlApp) => !!configApps.find((app) => app.urlname === urlApp)
);
let defaultSelectedUrlApps = configApps
  .filter((app) => app.selected)
  .map((app) => app.urlname);

// Make sure the url is valid - update it if not empty
if (!appsFromUrlValidated.length) {
  Url.searchParams.delete('apps');
  window.history.replaceState(null, '', Url.href);
} else {
  Url.searchParams.set('apps', appsFromUrlValidated.join('--'));
  window.history.replaceState(null, '', Url.href);
  defaultSelectedUrlApps = appsFromUrlValidated;
}

// @ts-ignore
const selectedApps = defaultSelectedUrlApps.map(
  (urlApp) =>
    (configApps.find((app) => app.urlname === urlApp) as AppConfigT).name
);

function updateUrl(selectedApps: string[]): void {
  if (!selectedApps.length) {
    Url.searchParams.delete('apps');
    window.history.replaceState(null, '', Url.href);
    return;
  }

  const selectedAppsUrlnames = selectedApps.map(
    (app) => appsConfigsMap[app].urlname
  );
  Url.searchParams.set('apps', selectedAppsUrlnames.join('--'));
  window.history.replaceState(null, '', Url.href);
}

export default Vue.extend({
  name: 'Main',
  components: {
    Github,
    Npm,
    TechRadar,
    GoogleTrends,
    LibsSelectorMobile,
    LibsSelectorDesktop,
  },

  data() {
    return {
      selectedApps,
    };
  },

  watch: {
    selectedApps(): void {
      // This is a workaround for a problem of being able to select a category
      // TODO: fix the problem
      const stateManIndex = this.selectedApps.indexOf('# State Management');
      const testingIndex = this.selectedApps.indexOf('# Testing');
      const frameworksIndex = this.selectedApps.indexOf('# Frameworks');
      const foundElementIndex = [
        stateManIndex,
        testingIndex,
        frameworksIndex,
      ].find((i) => i > -1);

      if (foundElementIndex !== undefined) {
        this.selectedApps.splice(foundElementIndex, 1);
        return;
      }

      updateUrl(this.selectedApps);
    },
  },
});
</script>
