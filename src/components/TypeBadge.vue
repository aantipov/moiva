<template>
  <span
    v-tooltip.html="tooltip"
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
import { defineComponent, PropType, computed, toRefs } from 'vue';

type TypeT = 'bundled' | 'separate';

export default defineComponent({
  name: 'TypeBadge',

  props: {
    value: {
      type: String as PropType<TypeT>,
      required: true,
    },
    typesPackage: {
      type: String,
      required: false,
      default: null,
    },
  },

  setup(props) {
    const { value, typesPackage } = toRefs(props);

    return {
      tooltip: computed(() => {
        if (value.value === 'bundled') {
          return '<div class="badge-wrapper"><p>Types definitions are bundled with the npm package</p></div>';
        } else if (value.value === 'separate') {
          return `<div class="badge-wrapper"><p>Types definitions are provided via a separate npm package: ${typesPackage.value}</p></div>`;
        }
      }),
    };
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
