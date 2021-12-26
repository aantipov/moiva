<template>
  <div>
    <div ref="triggerRef" class="px-1 cursor-pointer">
      <m-dots-icon class="text-gray-500" />
    </div>

    <div
      ref="contentRef"
      class="cursor-pointer text-gray-800 font-normal -mx-2 divide-gray-300 divide-y"
      @click="hide"
    >
      <div v-if="canCopy" class="menu-item" @click="$emit('copyShare')">
        Copy and Share (Twitter)
      </div>
      <div v-if="canCopy" class="menu-item" @click="$emit('copy')">
        Copy to clipboard
      </div>
      <div class="menu-item" @click="$emit('download')">Download</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import tippy, { Instance } from 'tippy.js';

defineEmits(['copy', 'copyShare', 'download']);

const contentRef = ref(null);
const triggerRef = ref(null);
// @ts-ignore
const canCopy = !!window.chrome;
let _t: Instance;

onMounted(() => {
  _t = tippy(triggerRef.value as unknown as HTMLElement, {
    content: contentRef.value as unknown as HTMLElement,
    trigger: 'click',
    delay: [0, 150],
    interactive: true,
    allowHTML: true,
    theme: 'chart-menu',
    hideOnClick: true,
  });
});

function hide() {
  _t.hide();
}
</script>

<style lang="postcss">
.tippy-box[data-theme~='chart-menu'] {
  @apply bg-gray-200 border border-gray-300 shadow text-base text-gray-800;
}
.tippy-box[data-theme~='chart-menu'] > .tippy-arrow {
  @apply hidden;
}
.tippy-box[data-theme~='chart-menu'] .menu-item {
  @apply whitespace-nowrap text-xl sm:text-base py-2 px-2 hover:bg-gray-600 hover:text-white;
}
</style>
