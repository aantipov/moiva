<template>
  <div>
    <div ref="triggerRef" class="cursor-default">
      <InfoIcon v-if="type === 'INFO'" />
      <WarningIcon v-else />
    </div>

    <div ref="contentRef">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import InfoIcon from '@/icons/InfoIcon.vue';
import WarningIcon from '@/icons/WarningIcon.vue';
import tippy, { animateFill } from 'tippy.js';

interface Props {
  type?: 'INFO' | 'WARNING';
}

withDefaults(defineProps<Props>(), {
  type: 'INFO',
});

const contentRef = ref(null);
const triggerRef = ref(null);

onMounted(() => {
  tippy(triggerRef.value as unknown as HTMLElement, {
    content: contentRef.value as unknown as HTMLElement,
    // trigger: 'click',
    animateFill: true,
    plugins: [animateFill],
    delay: [300, 150],
    interactive: true,
    allowHTML: true,
    theme: 'moiva',
    hideOnClick: 'toggle',
  });
});
</script>

<style lang="postcss">
.tippy-box[data-theme~='moiva'] > .tippy-arrow {
  @apply hidden;
}
.tippy-box[data-theme~='moiva'] p {
  @apply text-white;
}
.tippy-box[data-theme~='moiva'] a {
  @apply text-primary-light;
}
</style>
