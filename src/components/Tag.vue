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

<script setup lang="ts">
defineProps<{
  value: string;
}>();
</script>

<style lang="postcss" scoped></style>
