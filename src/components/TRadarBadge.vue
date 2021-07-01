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
          return '<div class="badge-wrapper"><p>Proven and mature for use. Consider using it.</p><p><a href="https://www.thoughtworks.com/radar/faq" target="_blank">More</a></p></div>';
        } else if (value.value === 'Trial') {
          return '<div class="badge-wrapper"><p>Ready for use, but not as completely proven as libraries in "ADOPT" ring.</p><p>Use it on a trial basis to decide whether it should be part of your tech stack.</p><p><a href="https://www.thoughtworks.com/radar/faq" target="_blank">More</a></p></div>';
        } else if (value.value === 'Assess') {
          return '<div class="badge-wrapper"><p>Worth looking at it closely, but not necessarily trial yet - unless you think it would be a particularly good fit for you.</p><p><a href="https://www.thoughtworks.com/radar/faq" target="_blank">More</a></p></div>';
        } else if (value.value === 'Hold') {
          return '<div class="badge-wrapper"><p>It is accepted in the industry, but you may run into trouble with it.</p><p>Recommendation: avoid using it.</p><p><a href="https://www.thoughtworks.com/radar/faq" target="_blank">More</a></p></div>';
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
