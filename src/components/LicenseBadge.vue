<template>
  <span
    v-tooltip.html="value.description"
    class="mr-1 inline-block rounded-full px-2 py-1 text-xs font-semibold uppercase text-white last:mr-0"
    :class="props.type"
  >
    {{ value.key }}
  </span>
</template>

<script setup lang="ts">
import { LicenseT, LicenseTypeT } from '@/getLibrary';

const props = defineProps<{
  value: LicenseT;
  type: LicenseTypeT;
}>();
</script>

<style lang="postcss" scoped>
.permissive {
  background-color: #449824;
}
.restrictive {
  background-color: #988f27;
}
.unknown {
  @apply bg-gray-500;
}
</style>
