<template>
  <div
    class="inline-flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-gray-100 bg-gray-700 border border-gray-700"
  >
    <div class="text-base font-normal leading-none max-w-full flex-initial">
      <slot></slot>
    </div>
    <div class="flex flex-auto flex-row-reverse">
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
          class="feather feather-x cursor-pointer hover:text-gray-400 rounded-full w-4 h-4 ml-2"
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
