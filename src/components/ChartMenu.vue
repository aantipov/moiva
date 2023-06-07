<template>
  <div>
    <div ref="triggerRef" class="cursor-pointer px-1">
      <m-dots-icon class="text-gray-500" />
    </div>

    <div
      ref="contentRef"
      class="-mx-2 cursor-pointer divide-y divide-gray-300 font-normal text-gray-800"
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
  @apply border border-gray-300 bg-gray-200 text-base text-gray-800 shadow;
}
.tippy-box[data-theme~='chart-menu'] > .tippy-arrow {
  @apply hidden;
}
.tippy-box[data-theme~='chart-menu'] .menu-item {
  @apply whitespace-nowrap px-2 py-2 text-xl hover:bg-gray-600 hover:text-white sm:text-base;
}
</style>
