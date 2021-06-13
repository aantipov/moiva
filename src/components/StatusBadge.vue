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
import { StatusT } from '@/getLibrary';

export default defineComponent({
  name: 'StatusBadge',

  props: {
    value: {
      type: String as PropType<StatusT>,
      required: true,
    },
  },

  setup() {
    return {};
  },
});
</script>

<style lang="postcss" scoped>
.active {
  background-color: #42bd14;
}
.inactive {
  @apply bg-gray-500;
}
.archived {
  background-color: #ce5740;
}
.legacy {
  background-color: #e77131;
}
</style>
