<template>
  <div>
    <span ref="triggerRef" class="p-1 rounded cursor-pointer hover:bg-gray-200"
      >&#9432;</span
    >
    <div ref="contentRef">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import 'tippy.js/themes/light-border.css';

export default defineComponent({
  name: 'ChartInfo',
  setup() {
    const contentRef = ref(null);
    const triggerRef = ref(null);

    onMounted(() => {
      tippy((triggerRef.value as unknown) as HTMLElement, {
        content: (contentRef.value as unknown) as HTMLElement,
        // trigger: 'click',
        interactive: true,
        allowHTML: true,
        theme: 'moiva',
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
