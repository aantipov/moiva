<template>
  <div id="app" class="container mx-auto">
    <div class="mx-4 sm:mx-2">
      <h1>JsDiff - compare javascript libraries with ease!</h1>

      <p class="text-center p-lead">
        Unbiased always up-to-date visual side by side comparison of javascript
        frameworks and libraries
      </p>

      <Main class="mt-4 sm:mt-8" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Main from './components/Main.vue';

export default Vue.extend({
  name: 'App',
  components: { Main },
});
</script>

<style scoped lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
