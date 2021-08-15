<template>
  <span
    v-tooltip.html="tooltip"
    class="
      inline-block
      px-2
      py-1
      mr-1
      text-xs
      font-semibold
      text-white
      uppercase
      rounded-full
      last:mr-0
    "
    :class="[value.toLowerCase()]"
  >
    {{ value }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  value: 'bundled' | 'separate';
  typesPackage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  typesPackage: '',
});

const tooltip = computed(() => {
  if (props.value === 'bundled') {
    // we need tippy-content here for Tailwind to recognize the class
    return '<div class="tippy-content">Types definitions are bundled with the npm package</div>';
  } else if (props.value === 'separate') {
    return `Types definitions are provided via a separate npm package: ${props.typesPackage}`;
  }
  return '';
});
</script>

<style lang="postcss" scoped>
.bundled {
  background-color: #449824;
}
.separate {
  background-color: #988f27;
}
</style>
