<template>
  <div id="app" class="mt-6 mx-10">
    <h1>JsStats - compare javascript libraries with ease!</h1>

    <p class="text-center p-lead">
      This project is a
      <strong class="font-medium">work in progress</strong>. More charts and
      supported libraries to come!
    </p>

    <Main class="mt-8" />

    <div class="footer">
      <div class="text-center p">
        If you notice any issues or have a feature request, please open an issue
        on
        <a
          href="https://github.com/aantipov/jsstats-issues"
          target="_blank"
          rel="noopener"
          >Github</a
        >!
      </div>
      <hr />
      <div class="text-center mt-4 p">
        Made by
        <a href="https://alexei.me" target="_blank" rel="noopener"
          >Alexey Antipov</a
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Main from './components/Main.vue';

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
  width: 800px;
  margin: 60px auto 30px;
}
</style>
