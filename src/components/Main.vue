<template>
  <div>
    <div class="text-center mb-5">
      <template v-for="app in apps">
        <VSwitch
          :key="app"
          v-model="appsMap[app]"
          :disabled="appsMap[app] && enabledApps.length === 1"
          >{{ app }}</VSwitch
        >
      </template>
    </div>

    <Github :apps="enabledApps" />
    <Npm :apps="enabledApps" />
    <TechRadar :apps="enabledApps" style="margin-top: 24px" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Npm from './Npm.vue';
import Github from './Github.vue';
import TechRadar from './TechRadar.vue';
import VSwitch from './Switch.vue';
import config from '../../apps-config';

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
        acc[app] = true;
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
