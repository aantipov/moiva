<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="w-5 h-5"
    role="img"
    :aria-label="label"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fill-rule="evenodd"
      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
      clip-rule="evenodd"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DownloadIcon',

  props: {
    label: {
      type: String,
      required: false,
      default: 'Download icon',
    },
  },
});
</script>

<style lang="postcss" scoped></style>
