<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-5 w-5"
    role="img"
    :aria-label="label"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DotsIcon',

  props: {
    label: {
      type: String,
      required: false,
      default: '',
    },
  },
});
</script>

<style lang="postcss" scoped></style>
