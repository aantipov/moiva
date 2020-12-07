<template>
  <div id="app" class="container mx-auto">
    <div class="mx-4 sm:mx-2">
      <h1>JsDiff - compare javascript libraries with ease!</h1>

      <p class="text-center p-lead">
        Unbiased always up-to-date visual side by side comparison of javascript
        frameworks and libraries
      </p>

      <p class="text-center">
        This project is a
        <strong class="font-medium">work in progress</strong>. More charts and
        supported libraries to come!
      </p>

      <Main class="mt-4 sm:mt-8" />

      <div class="footer">
        <div class="text-center">
          <p>
            If you notice any issues or have a feature request, please open an
            issue on
            <a
              href="https://github.com/aantipov/jsdiff-issues"
              target="_blank"
              rel="noopener"
              >Github</a
            >.
          </p>
          <p>
            Follow me on
            <a href="https://twitter.com/_aantipov" target="_blank">Twitter</a>
            to be notified about project updates
          </p>
        </div>
        <hr />
        <div class="mt-4 text-center p">
          Made by
          <a href="https://alexei.me" target="_blank" rel="noopener"
            >Alexey Antipov</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Main from './components/Main.vue';
import Chart from 'chart.js';

// @ts-ignore
Chart.defaults.global.title.fontSize = 14;
Chart.defaults.global.defaultFontSize = 14;
// @ts-ignore
Chart.defaults.global.title.fontFamily =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
Chart.defaults.global.defaultFontFamily =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
// @ts-ignore
Chart.defaults.global.legend.labels.boxWidth = 20;
Chart.defaults.global.tooltips.mode = 'index';
Chart.defaults.global.tooltips.position = 'nearest';
Chart.defaults.global.tooltips.intersect = false;
Chart.defaults.global.maintainAspectRatio = false;

export default Vue.extend({
  name: 'App',
  components: {
    Main,
  },
});
</script>

<style scoped lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.footer {
  margin: 60px auto 30px;
}
</style>
