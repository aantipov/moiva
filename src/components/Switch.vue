<template>
  <div class="inline-flex items-center switch">
    <div class="relative">
      <input
        type="checkbox"
        class="hidden"
        :checked="checked"
        @change="toggle"
      />

      <div
        class="line"
        :class="{
          line_on: checked,
          line_off: !checked,
          line_disabled: disabled,
        }"
        @click="toggle"
      ></div>

      <div
        class="dot"
        :class="{ dot_on: checked, dot_off: !checked, dot_disabled: disabled }"
        @click="toggle"
      ></div>
    </div>

    <!-- label -->
    <div class="label" :class="{ label_disabled: disabled }" @click="toggle">
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
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  methods: {
    toggle(): void {
      if (!this.disabled) {
        this.$emit('change', !this.checked);
      }
    },
  },
});
</script>

<style lang="postcss" scoped>
.switch ~ .switch {
  @apply ml-3;
}
.label {
  @apply ml-3 text-gray-700 font-medium cursor-pointer;
}
.label.label_disabled {
  @apply text-gray-500 cursor-default;
}
.line {
  @apply w-10 h-4 rounded-full shadow-inner cursor-pointer;
}
.line_on {
  @apply bg-green-300;
  transition: all 0.2s ease-in-out;
}
.line_off {
  @apply bg-gray-400;
  transition: all 0.2s ease-in-out;
}
.line_on.line_disabled {
  @apply bg-green-200 cursor-default;
  transition: all 0.2s ease-in-out;
}
.line_off.line_disabled {
  @apply bg-gray-200 cursor-default;
  transition: all 0.2s ease-in-out;
}
.dot {
  @apply absolute w-6 h-6 rounded-full shadow inset-y-0 left-0 cursor-pointer;
  top: -0.25rem;
  left: -0.25rem;
  transition: all 0.2s ease-in-out;
}
.dot_on {
  @apply bg-green-500;
  transform: translateX(100%);
}
.dot_off {
  @apply bg-white;
}
.dot_on.dot_disabled {
  @apply bg-green-300 cursor-default;
  transition: all 0.2s ease-in-out;
}
</style>
