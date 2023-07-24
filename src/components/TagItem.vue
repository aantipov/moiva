<template>
  <span
    class="m-1 whitespace-nowrap rounded-md border border-gray-500 px-2 py-1 text-sm"
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
