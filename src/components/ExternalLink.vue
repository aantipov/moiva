<template>
  <a :href="href" class="flex items-center max-w-full" target="_blank">
    <span class="whitespace-nowrap" :class="{ trunc: truncate }">{{
      txt
    }}</span>
    <icon class="flex-shrink-0 ml-1" />
  </a>
</template>

<script setup lang="ts">
import Icon from '@/icons/LinkIcon.vue';

withDefaults(
  defineProps<{
    href: string;
    txt: string;
    truncate?: boolean;
  }>(),
  {
    truncate: false,
  }
);
</script>

<style lang="postcss">
.trunc {
  @apply truncate;
}
</style>
