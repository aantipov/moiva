<template>
  <div class="inline-block">
    <span
      class="mr-2 mt-2 inline-block cursor-pointer rounded border border-primary bg-primary px-1 text-base text-white hover:bg-black/10 hover:text-primary hover:underline hover:shadow-md active:bg-black/20 active:shadow-none"
      @click.prevent="$emit('select', library)"
      >- {{ library.alias }}</span
    >
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { TrimmedLibraryT } from '@/nanostore/trimmedLibraries';

defineEmits(['select']);

defineProps({
  library: {
    type: Object as PropType<TrimmedLibraryT>,
    required: true,
  },
});
</script>
