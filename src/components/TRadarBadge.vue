<template>
  <span
    v-tooltip.html="tooltip"
    class="mr-1 inline-block rounded-full px-2 py-1 text-xs font-semibold uppercase text-white last:mr-0"
    :class="[value.toLowerCase()]"
  >
    {{ value }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { TRadarLevelT } from '@/data/index';

const props = defineProps<{
  value: TRadarLevelT;
}>();

const tooltip = computed(() => {
  let txt;
  if (props.value === 'Adopt') {
    txt = '<p>Proven and mature for use. Consider using it.</p>';
  } else if (props.value === 'Trial') {
    txt =
      '<p>Ready for use, but not as completely proven as libraries in "ADOPT" ring.</p><p>Use it on a trial basis to decide whether it should be part of your tech stack.</p>';
  } else if (props.value === 'Assess') {
    txt =
      '<p>Worth looking at it closely, but not necessarily trial yet - unless you think it would be a particularly good fit for you.</p>';
  } else if (props.value === 'Hold') {
    txt =
      '<p>It is accepted in the industry, but you may run into trouble with it.</p><p>Recommendation: avoid using it.</p>';
  }
  return `${txt}<p><a href="https://www.thoughtworks.com/radar/faq" target="_blank">Read more</a></p>`;
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
