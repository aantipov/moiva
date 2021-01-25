<template>
  <div class="flex items-center space-x-3">
    <a
      v-if="thoughtworksUrl"
      :href="thoughtworksUrl"
      target="_blank"
      class="inline-block"
    >
      <ThoughtworksIcon class="w-5 sm:w-6" />
    </a>

    <a :href="bundlephobiaUrl" target="_blank" class="inline-block">
      <BundlephobiaIcon class="w-5 sm:w-6" />
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import BundlephobiaIcon from './icons/Bundlephobia.vue';
import ThoughtworksIcon from './icons/Thoughtworks.vue';
import { libsToLinkMap } from '../../techradar.config';
import { getBundlephobiaUrl } from '@/utils';

export default defineComponent({
  name: 'LibExternalLinks',

  components: {
    BundlephobiaIcon,
    ThoughtworksIcon,
  },

  props: {
    libName: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const { libName } = toRefs(props);
    const bundlephobiaUrl = computed(() => getBundlephobiaUrl(libName.value));
    const thoughtworksUrl = computed<string | null>(
      () => libsToLinkMap[libName.value] || null
    );

    return {
      bundlephobiaUrl,
      thoughtworksUrl,
    };
  },
});
</script>
