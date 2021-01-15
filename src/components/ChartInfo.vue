<template>
  <div>
    <span
      ref="triggerRef"
      class="p-1 rounded-full cursor-pointer hover:bg-yellow-600 hover:bg-opacity-30"
    >
      <template v-if="type === 'INFO'">&#9432;</template>
      <template v-else>&#9888;</template>
    </span>
    <div ref="contentRef">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import tippy, { animateFill } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import 'tippy.js/themes/light-border.css';
import 'tippy.js/dist/backdrop.css';
import 'tippy.js/animations/shift-away.css';

export default defineComponent({
  name: 'ChartInfo',

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
      tippy((triggerRef.value as unknown) as HTMLElement, {
        content: (contentRef.value as unknown) as HTMLElement,
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
  @apply bg-gray-800 bg-opacity-95 border border-gray-200 shadow text-base;
}
.tippy-box[data-theme~='moiva'] > .tippy-arrow {
  @apply hidden;
}
.tippy-box[data-theme~='moiva'] p {
  @apply text-gray-50;
}
.tippy-box[data-theme~='moiva'] a {
  @apply text-blue-300;
}
</style>
