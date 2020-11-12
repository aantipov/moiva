<template>
  <div id="app">
    <h1>JsStats - use numbers to decide which library to use!</h1>
    <p>
      This project is a <strong>work in progress</strong> and is currently
      limited to Vue/React only
    </p>

    <h1>Vue vs React</h1>

    <Main />

    <div class="footer">
      <div>
        If you notice any issues or have a feature request, please open an issue
        on
        <a href="https://github.com/aantipov/jsstats-issues" target="_blank"
          >Github</a
        >!
      </div>
      <hr />
      <div class="sign">
        Made by <a href="https://alexei.me" target="_blank">Alexey Antipov</a>
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
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  max-width: 1700px;
  margin: 60px auto 0;
}
.footer {
  width: 800px;
  margin: 60px auto 20px;
}
.sign {
  margin-top: 20px;
}
</style>
