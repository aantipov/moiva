<template>
  <a :href="href" class="flex items-center whitespace-nowrap" target="_blank">
    <span :class="{ trunc: truncate }">{{ txt }}</span>
    <icon class="ml-1" />
  </a>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Icon from '@/components/icons/Link.vue';

export default defineComponent({
  name: 'ExternalLink',

  components: { Icon },

  props: {
    href: {
      type: String,
      required: true,
    },
    txt: {
      type: String,
      required: true,
    },
    truncate: Boolean,
  },
});
</script>

<style lang="postcss">
.trunc {
  @apply truncate;
  max-width: 140px;
}
</style>
