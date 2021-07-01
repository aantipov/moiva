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
import { TRadarLevelT } from '@/data/index';

export default defineComponent({
  name: 'TRadarBadge',

  props: {
    value: {
      type: String as PropType<TRadarLevelT>,
      required: true,
    },
  },

  setup(props) {
    const { value } = toRefs(props);

    return {
      tooltip: computed(() => {
        if (value.value === 'Adopt') {
          return 'Proven and mature for use. Consider using it.';
        } else if (value.value === 'Trial') {
          return 'Ready for use, but not as completely proven as libraries in "ADOPT" ring.<br> Use it on a trial basis to decide whether it should be part of your tech stack.';
        } else if (value.value === 'Assess') {
          return 'Worth looking at it closely, but not necessarily trial yet - unless you think it would be a particularly good fit for you.';
        } else if (value.value === 'Hold') {
          return 'It is accepted in the industry, but you may run into trouble with it.<br> Recommendation: avoid using it.';
        }
      }),
    };
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
