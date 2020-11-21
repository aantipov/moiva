<template>
  <div>
    <div class="text-center mt-5 mb-5">
      <v-select
        v-model="selectedApps"
        multiple
        :close-on-select="false"
        :options="apps"
        label="name"
        :reduce="(app) => app.name"
      >
        <template #selected-option-container="{ option, deselect }">
          <div
            class="vs__selected cursor-pointer"
            @click.prevent="deselect(option)"
          >
            {{ option.name }}
          </div>
        </template>
      </v-select>
    </div>

    <div v-if="selectedApps.length">
      <Github v-if="false" class="mt-0" :apps="selectedApps" />

      <div class="grid grid-cols-12 gap-4">
        <Npm
          v-if="false"
          :apps="selectedApps"
          class="col-span-12 xl:col-span-8"
        />
        <TechRadar :apps="selectedApps" class="col-span-12 xl:col-span-4" />
      </div>
    </div>

    <div v-else>Select a library</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Chart from 'chart.js';
import Npm from './Npm.vue';
import Github from './Github.vue';
import TechRadar from './TechRadar.vue';
import configApps, { appsConfigsMap } from '../../apps-config';
import vSelect from 'vue-select';
import 'vue-select/src/scss/vue-select.scss';

Vue.component('v-select', vSelect);

// @ts-ignore
Chart.defaults.global.title.fontSize = 14;
Chart.defaults.global.defaultFontSize = 14;
// @ts-ignore
Chart.defaults.global.title.fontFamily =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
Chart.defaults.global.defaultFontFamily =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

const apps = configApps;

export default Vue.extend({
  name: 'Main',
  components: {
    Github,
    Npm,
    TechRadar,
  },
  data() {
    return {
      apps,
      selectedApps: apps.filter((app) => app.selected).map((app) => app.name),
    };
  },
});
</script>
