<template>
  <div>
    <div class="text-center mt-5 mb-5">
      <template v-for="app in apps">
        <VSwitch
          :key="app"
          v-model="appsMap[app]"
          :disabled="appsMap[app] && enabledApps.length === 1"
          >{{ app }}</VSwitch
        >
      </template>
    </div>

    <Github class="mt-10" :apps="enabledApps" />
    <Npm class="mt-10" :apps="enabledApps" />
    <TechRadar class="mt-10" :apps="enabledApps" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Chart from 'chart.js';
import Npm from './Npm.vue';
import Github from './Github.vue';
import TechRadar from './TechRadar.vue';
import VSwitch from './Switch.vue';
import config, { appsConfigsMap } from '../../apps-config';

// @ts-ignore
Chart.defaults.global.title.fontSize = 14;
Chart.defaults.global.defaultFontSize = 14;
// @ts-ignore
Chart.defaults.global.title.fontFamily =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
Chart.defaults.global.defaultFontFamily =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

const apps = config.map((app) => app.name);

export default Vue.extend({
  name: 'Main',
  components: {
    Github,
    Npm,
    TechRadar,
    VSwitch,
  },
  data() {
    return {
      apps,
      appsMap: apps.reduce((acc, app) => {
        acc[app] = appsConfigsMap[app].load;
        return acc;
      }, {} as Record<string, boolean>),
    };
  },
  computed: {
    enabledApps(): string[] {
      return Object.entries(this.appsMap)
        .filter(([, value]) => value)
        .map(([key]) => key);
    },
  },
});
</script>
