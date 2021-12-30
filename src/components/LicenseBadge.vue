<template>
  <span
    v-tooltip.html="value.description"
    class="inline-block px-2 py-1 mr-1 text-xs font-semibold text-white uppercase rounded-full last:mr-0"
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
