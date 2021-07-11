<template>
  <div>
    <div ref="triggerRef" class="px-1 cursor-pointer">
      <m-dots-icon class="text-gray-500" />
    </div>
    <div
      ref="contentRef"
      class="cursor-pointer text-gray-800 font-normal"
      @click="hide"
    >
      <div class="whitespace-nowrap" @click="$emit('copy')">
        Copy to clipboard
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import tippy, { Instance } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/dist/backdrop.css';

export default defineComponent({
  name: 'ChartMenu',

  emits: ['copy'],

  setup() {
    const contentRef = ref(null);
    const triggerRef = ref(null);
    let t: Instance;

    onMounted(() => {
      t = tippy(triggerRef.value as unknown as HTMLElement, {
        content: contentRef.value as unknown as HTMLElement,
        trigger: 'click',
        delay: [0, 150],
        interactive: true,
        allowHTML: true,
        theme: 'chart-menu',
        hideOnClick: true,
      });
    });

    return {
      triggerRef,
      contentRef,
      hide() {
        t.hide();
      },
    };
  },
});
</script>

<style lang="postcss">
.tippy-box[data-theme~='chart-menu'] {
  @apply bg-gray-200 border border-gray-200 shadow text-base text-gray-800;
}
.tippy-box[data-theme~='chart-menu'] > .tippy-arrow {
  @apply hidden;
}
</style>
