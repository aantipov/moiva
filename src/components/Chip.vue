<template>
  <div
    class="inline-flex items-center justify-center h-8 py-1 m-1 font-medium border border-gray-700 rounded-full cursor-pointer tab"
    :class="{ selected: selected }"
    @click="$emit('toggle')"
  >
    <div class="flex-initial max-w-full text-base font-normal leading-none">
      <slot></slot>
    </div>

    <div v-show="selected" class="flex flex-row-reverse flex-auto">
      <div @click="$emit('close')">
        <Close />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Close from './icons/Close.vue';

export default Vue.extend({
  name: 'VChip',
  components: {
    Close,
  },
  props: {
    selected: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="postcss" scoped>
.tab {
  @apply bg-gray-200 text-gray-800 px-5;
}
.tab.selected {
  @apply bg-gray-700 text-gray-100 px-2;
}
</style>
