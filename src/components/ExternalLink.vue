<template>
  <a :href="href" class="flex items-center" target="_blank">
    <span :class="{ trunc: truncate }">{{ txt }}</span>
    <icon class="flex-shrink-0 ml-1" />
  </a>
</template>

<script setup lang="ts">
import Icon from '@/components/icons/LinkIcon.vue';

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
  max-width: 140px;
}
</style>
