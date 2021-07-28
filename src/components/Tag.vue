<template>
  <span
    class="
      flex
      whitespace-nowrap
      justify-center
      items-center
      rounded-full
      border border-blue-300
      bg-blue-200
      text-sm
      m-1
      px-2
    "
  >
    {{ value }}
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'StatusBadge',

  props: {
    value: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="postcss" scoped></style>
