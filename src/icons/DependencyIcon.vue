<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-5 w-5"
    role="img"
    :aria-label="label"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 32 32"
  >
    <path
      d="M30 10V2h-8v3h-5a2.002 2.002 0 0 0-2 2v8h-5v-3H2v8h8v-3h5v8a2.002 2.002 0 0 0 2 2h5v3h8v-8h-8v3h-5v-8h5v3h8v-8h-8v3h-5V7h5v3zM8 18H4v-4h4zm16 6h4v4h-4zm0-10h4v4h-4zm0-10h4v4h-4z"
      fill="black"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>

<style lang="postcss" scoped></style>
