<template>
  <span
    v-tooltip.html="value.description"
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
    :class="classname"
  >
    {{ value.key }}
  </span>
</template>

<script lang="ts">
import { defineComponent, PropType, toRefs, computed } from 'vue';
import { LicenseT } from '@/getLibrary';

export default defineComponent({
  name: 'LicenseBadge',

  props: {
    value: { type: Object as PropType<LicenseT>, required: true },
  },

  setup(props) {
    const { value } = toRefs(props);
    const license = value.value;

    return {
      // tooltip: computed(() => {
      //   return licensesMap[val]?.description || value.value;
      // }),
      classname: computed(() => {
        if (license.key === 'mit') {
          return 'permissive';
        } else if (license.key === 'apache-2.0') {
          return 'warning';
        } else {
          return 'unknown';
        }
      }),
    };
  },
});
</script>

<style lang="postcss" scoped>
.permissive {
  background-color: #449824;
}
.warning {
  background-color: #988f27;
}
.unknown {
  @apply bg-gray-500;
}
</style>
