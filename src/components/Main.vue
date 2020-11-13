<template>
  <div>
    <Github />
    <Npm />
    <TechRadar style="margin-top: 24px" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Npm from './Npm.vue';
import Github from './Github.vue';
import TechRadar from './TechRadar.vue';

export default Vue.extend({
  name: 'Main',
  components: {
    Github,
    Npm,
    TechRadar,
  },
});
</script>
