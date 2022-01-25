<template>
  <span
    class="m-1 flex items-center justify-center whitespace-nowrap rounded-full border border-blue-300 bg-blue-200 px-2 text-sm"
  >
    {{ value }}
  </span>
</template>

<script setup lang="ts">
defineProps<{
  value: string;
}>();
</script>

<style lang="postcss" scoped></style>
