<template>
  <div id="app">
    <h1 class="h1">JsStats - use numbers to decide which library to use!</h1>
    <p class="text-center p-lead">
      This project is a
      <strong class="font-medium">work in progress</strong> and is currently
      limited to Vue/React only
    </p>

    <h2 class="h2">Vue vs React</h2>

    <Main />

    <div class="footer">
      <div class="text-center p">
        If you notice any issues or have a feature request, please open an issue
        on
        <a
          class="link"
          href="https://github.com/aantipov/jsstats-issues"
          target="_blank"
          >Github</a
        >!
      </div>
      <hr />
      <div class="text-center mt-4 p">
        Made by
        <a class="link" href="https://alexei.me" target="_blank"
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
  max-width: 1700px;
  margin: 40px auto 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.footer {
  width: 800px;
  margin: 60px auto 30px;
}
</style>
