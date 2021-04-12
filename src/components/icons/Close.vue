<template>
  <div class="root">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="text-black rounded-full cursor-pointer text-opacity-60 feather feather-x hover:text-black"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CloseIcon',
});
</script>

<style lang="postcss" scoped>
.root {
  width: 24px;
  height: 24px;
}
</style>
