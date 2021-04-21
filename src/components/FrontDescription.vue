<template>
  <div>
    <div class="flex justify-center mx-4 italic sm:mx-0">
      We aggregate data from different sources to do better Software Evaluation
      and Comparison.
    </div>

    <div
      class="flex flex-wrap items-center justify-center mt-2 overflow-hidden"
    >
      <img src="/images/google-logo.png?v1" alt="" class="mt-2 max-h-10" />
      <img src="/images/npm-logo.png?v1" alt="" class="mt-2 ml-4 max-h-9" />
      <img src="/images/github-logo.png?v1" alt="" class="ml-4 max-h-8" />
      <img
        src="/images/thoughtworks-logo.png?v2"
        alt=""
        class="mt-2 ml-4 max-h-9"
      />
      <img
        src="/images/stateofjs-logo.png?v1"
        alt=""
        class="mt-1 ml-4 sm:mt-0 max-h-20"
      />
      <img
        src="/images/snyk-logo.png?v1"
        alt=""
        class="mt-1 ml-4 ml-5 max-h-20"
      />
      <img
        src="/images/bundlephobia-logo.png?v1"
        alt=""
        class="mt-1 max-h-20"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FrontDescription',

  components: {},

  setup() {
    return {};
  },
});
</script>

<style lang="postcss" scoped></style>
