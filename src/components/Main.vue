<template>
  <div>
    <div v-if="false" class="text-center mb-5">
      <VSwitch v-model="vue">Vue</VSwitch>
      <VSwitch v-model="react" class="ml-3">React</VSwitch>
    </div>
    <Github :apps="apps" />
    <Npm />
    <TechRadar style="margin-top: 24px" />
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
    return apps.reduce((acc: any, app) => {
      acc[app] = true;
      return acc;
    }, {});
  },
  computed: {
    apps() {
      // @ts-ignore
      const { vue, react } = this;
      return Object.entries({ vue, react })
        .filter(([key, value]) => value)
        .map(([key]) => key);
    },
  },
});
</script>
