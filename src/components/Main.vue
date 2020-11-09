<template>
  <div>
    <Github />
    <Npm />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Npm from './Npm.vue';
import Github from './Github.vue';

export default Vue.extend({
  name: 'Main',
  components: {
    Github,
    Npm,
  },
});
</script>
