<template>
  <div class="inline-block">
    <span
      class="mr-2 mt-2 inline-block cursor-pointer rounded border border-primary bg-primary px-1 text-base text-white hover:bg-black/10 hover:text-primary hover:underline hover:shadow-md active:bg-black/20 active:shadow-none"
      @click.prevent="$emit('select', library)"
      >- {{ library.npm.name }}</span
    >
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { TrimmedLibraryT } from '@/nanostore/trimmedLibraries';

defineEmits(['select']);

defineProps({
  library: {
    type: Object as PropType<TrimmedLibraryT>,
    required: true,
  },
});
</script>
