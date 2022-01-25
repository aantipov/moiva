<template>
  <a :href="href" class="flex max-w-full items-center" target="_blank">
    <span :class="{ trunc: truncate }">{{ txt }}</span>
    <icon class="ml-1 flex-shrink-0" />
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
