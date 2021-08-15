<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    :aria-label="label"
    viewBox="0 0 66 36"
    fill="#fff"
    fill-rule="evenodd"
    stroke="#000"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path
      style="color: black; fill: currentColor"
      d="M0 5.93V0h25.132v5.93h-9.06v29h-7v-29zM29.255 0h3.5L38.5 28.2 44.87 0h3.463l6.052 28.188L60.535 0H64l-8 34.92h-3.587l-5.93-28.546L40.16 34.92h-3.587z"
      stroke="none"
    />
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>
