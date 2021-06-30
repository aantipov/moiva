<template>
  <span
    v-tooltip.html="tooltip"
    class="inline-block px-2 py-1 mr-1 text-xs font-semibold text-white uppercase rounded-full last:mr-0"
    :class="[value.toLowerCase()]"
  >
    {{ value }}
  </span>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs, computed } from 'vue';
import { StatusT } from '@/getLibrary';

export default defineComponent({
  name: 'StatusBadge',

  props: {
    value: {
      type: String as PropType<StatusT>,
      required: true,
    },
  },

  setup(props) {
    const { value } = toRefs(props);

    return {
      tooltip: computed(() => {
        if (value.value === 'ACTIVE') {
          return `- there have been commits in the last 6 months <br> - the repository is not tagged as Legacy or Archived`;
        } else if (value.value === 'INACTIVE') {
          return `- no commits in the last 6 months <br> - the repository is not tagged as Legacy or Archived.`;
        } else if (value.value === 'LEGACY') {
          return `The project is marked as Legacy. <br> It is no longer under active development. <br> Better use alternative solutions.`;
        } else if (value.value === 'ARCHIVED') {
          return `The repository is Archived and is not recommended for usage. <br>Look for alternatives.`;
        }

        return '';
      }),
    };
  },
});
</script>

<style lang="postcss" scoped>
.active {
  background-color: #449824;
}
.inactive {
  @apply bg-gray-500;
}
.archived {
  background-color: #b91c1c;
}
.legacy {
  background-color: #e77131;
}
</style>
