<template>
  <div>
    <div ref="triggerRef" class="mt-1 cursor-pointer">
      <InfoIcon v-if="type === 'INFO'" />
      <WarningIcon v-else />
    </div>
    <div ref="contentRef">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import InfoIcon from '@/components/icons/Info.vue';
import WarningIcon from '@/components/icons/Warning.vue';
import tippy, { animateFill } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import 'tippy.js/themes/light-border.css';
import 'tippy.js/dist/backdrop.css';
import 'tippy.js/animations/shift-away.css';

export default defineComponent({
  name: 'ChartInfo',

  components: {
    InfoIcon,
    WarningIcon,
  },

  props: {
    type: {
      type: String as () => 'INFO' | 'WARNING',
      required: false,
      default: 'INFO',
    },
  },

  setup() {
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

    return { triggerRef, contentRef };
  },
});
</script>

<style lang="postcss">
.tippy-box[data-theme~='moiva'] {
  /* @apply bg-black bg-opacity-10 border border-gray-200 shadow text-base; */
}
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
