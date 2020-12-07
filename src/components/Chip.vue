<template>
  <div
    class="inline-flex items-center justify-center h-8 py-1 mx-1 my-2 font-medium border rounded-full outline-none cursor-pointer focus:outline-none root"
    :class="{ selected: selected }"
    @click="$emit('toggle')"
  >
    <div class="flex-initial max-w-full text-base font-normal leading-none">
      <slot></slot>
    </div>

    <div v-show="selected" class="flex flex-row-reverse flex-auto">
      <div @click="$emit('close')">
        <jd-close />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Chip',
  props: {
    selected: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="postcss" scoped>
.root {
  /* Remove highlight on tap */
  -webkit-tap-highlight-color: transparent;
  @apply bg-gray-200 text-gray-600 pl-2 pr-8 border-gray-400;
}
.root.selected {
  @apply bg-gray-700 text-gray-100 px-2 border-gray-700;
}
</style>
