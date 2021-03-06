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
        let txt;
        if (value.value === 'ACTIVE') {
          txt = `<p>- there have been commits in the last 6 months <br> - the repository is not tagged as Legacy or Archived</p>`;
        } else if (value.value === 'INACTIVE') {
          txt = `<p>- no commits in the last 6 months <br> - the repository is not tagged as Legacy or Archived.</p>`;
        } else if (value.value === 'LEGACY') {
          txt = `<p>The project is marked as Legacy.</p> <p>It is no longer under active development.</p> <p>Better use alternative solutions.</p>`;
        } else if (value.value === 'ARCHIVED') {
          txt = `<p>The repository is Archived and is not recommended for usage.</p><p>Look for alternatives.</p>`;
        }

        return `${txt}`;
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
