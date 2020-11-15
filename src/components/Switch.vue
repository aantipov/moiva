<template>
  <div class="inline-flex items-center">
    <div class="relative">
      <!-- input -->
      <input
        type="checkbox"
        class="hidden"
        :checked="checked"
        @change="$emit('change', $event.target.checked)"
      />
      <!-- line -->
      <div
        class="toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-inner cursor-pointer"
        @click="$emit('change', !checked)"
      ></div>
      <!-- dot -->
      <div
        class="toggle__dot absolute w-6 h-6 bg-white rounded-full shadow inset-y-0 left-0 cursor-pointer"
        @click="$emit('change', !checked)"
      ></div>
    </div>

    <!-- label -->
    <div
      class="ml-3 text-gray-700 font-medium cursor-pointer"
      @click="$emit('change', !checked)"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'VSwitch',
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: {
    checked: Boolean,
  },
});
</script>

<style scoped>
.toggle__dot {
  top: -0.25rem;
  left: -0.25rem;
  transition: all 0.2s ease-in-out;
}

input:checked ~ .toggle__dot {
  transform: translateX(100%);
  background-color: #48bb78;
}
</style>
