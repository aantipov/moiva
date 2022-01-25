<template>
  <span
    v-tooltip.html="tooltip"
    class="mr-1 inline-block rounded-full px-2 py-1 text-xs font-semibold uppercase text-white last:mr-0"
    :class="[value.toLowerCase()]"
  >
    {{ value }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { StatusT } from '@/getLibrary';

const props = defineProps<{
  value: StatusT;
}>();

const tooltip = computed(() => {
  let txt;
  if (props.value === 'ACTIVE') {
    txt = ``;
  } else if (props.value === 'INACTIVE') {
    txt = `<p>No commits in the last 6 months</p>`;
  } else if (props.value === 'LEGACY') {
    txt = `<p>The project is marked as Legacy.</p> <p>It is no longer under active development.</p> <p>Better use alternative solutions.</p>`;
  } else if (props.value === 'ARCHIVED') {
    txt = `<p>The repository is Archived and is not recommended for usage.</p><p>Look for alternatives.</p>`;
  }

  return `${txt}`;
});
</script>

<style lang="postcss" scoped>
.active {
  background-color: #449824;
}
.inactive {
  @apply bg-gray-500;
}
.archived {
  background-color: #b91c1c;
}
.legacy {
  background-color: #e77131;
}
</style>
