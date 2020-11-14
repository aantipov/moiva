<template>
  <div id="app">
    <h1
      class="text-center text-5xl font-normal leading-normal mt-0 mb-2 text-gray-800"
    >
      JsStats - use numbers to decide which library to use!
    </h1>
    <p
      class="text-center text-lg font-light leading-relaxed mt-6 mb-4 text-gray-800"
    >
      This project is a
      <strong class="font-medium">work in progress</strong> and is currently
      limited to Vue/React only
    </p>

    <h1
      class="text-center text-4xl font-normal leading-normal mt-6 mb-4 text-gray-800"
    >
      Vue vs React
    </h1>

    <Main />

    <div class="footer">
      <div
        class="text-center text-base font-light leading-relaxed mt-0 mb-4 text-gray-800"
      >
        If you notice any issues or have a feature request, please open an issue
        on
        <a
          class="font-light text-blue-500 underline hover:text-blue-700"
          href="https://github.com/aantipov/jsstats-issues"
          target="_blank"
          >Github</a
        >!
      </div>
      <hr />
      <div
        class="sign text-center text-base font-light leading-relaxed mt-0 mb-4 text-gray-800"
      >
        Made by
        <a
          class="font-light text-blue-500 underline hover:text-blue-700"
          href="https://alexei.me"
          target="_blank"
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
}
.footer {
  width: 800px;
  margin: 60px auto 20px;
}
.sign {
  margin-top: 20px;
}
</style>
