<template>
  <div
    class="inline-flex items-center justify-center px-2 py-1 m-1 font-medium text-gray-100 bg-white bg-gray-700 border border-gray-700 rounded-full"
  >
    <div class="flex-initial max-w-full text-base font-normal leading-none">
      <slot></slot>
    </div>
    <div class="flex flex-row-reverse flex-auto">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="w-5 h-5 ml-2 rounded-full cursor-pointer feather feather-x hover:text-gray-400"
          @click="$emit('close')"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'VChip',
});
</script>
