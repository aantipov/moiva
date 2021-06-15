<template>
  <span
    class="
      inline-block
      px-2
      py-1
      mr-1
      text-xs
      font-semibold
      text-white
      uppercase
      rounded-full
      last:mr-0
    "
    :class="[value.toLowerCase()]"
  >
    {{ value }}
  </span>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

type TypeT = 'bundled' | 'separate';

export default defineComponent({
  name: 'TypeBadge',

  props: {
    value: {
      type: String as PropType<TypeT>,
      required: true,
    },
  },

  setup() {
    return {};
  },
});
</script>

<style lang="postcss" scoped>
.bundled {
  background-color: #449824;
}
.separate {
  background-color: #988f27;
}
</style>
