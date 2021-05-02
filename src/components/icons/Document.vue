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
      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
      clip-rule="evenodd"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DocumentIcon',

  props: {
    label: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="postcss" scoped></style>
