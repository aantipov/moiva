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
import { TRadarLevelT } from '@/data/index';

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
.adopt {
  background-color: #449824;
}
.trial {
  background-color: #988f27;
}
.assess {
  background-color: #988f27;
}
.hold {
  background-color: #b91c1c;
}
</style>
