<template>
  <div class="flex items-center space-x-3">
    <a :href="npmUrl" target="_blank" class="inline-block">
      <NpmIcon class="w-10 sm:w-12" />
    </a>

    <a :href="repoUrl" target="_blank" class="inline-block">
      <GithubIcon class="w-5 h-5 sm:w-6 sm:h-6" />
    </a>

    <a :href="bundlephobiaUrl" target="_blank" class="inline-block">
      <BundlephobiaIcon class="w-5 sm:w-6" />
    </a>

    <a
      v-if="thoughtworksUrl"
      :href="thoughtworksUrl"
      target="_blank"
      class="inline-block"
    >
      <ThoughtworksIcon class="w-5 sm:w-6" />
    </a>
    <span v-else class="w-5 sm:w-6"></span>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import GithubIcon from './icons/Github.vue';
import BundlephobiaIcon from './icons/Bundlephobia.vue';
import NpmIcon from './icons/Npm.vue';
import ThoughtworksIcon from './icons/Thoughtworks.vue';
import { libsToLinkMap } from '../../techradar.config';
import { getBundlephobiaUrl } from '@/utils';

export default defineComponent({
  name: 'LibExternalLinks',

  components: {
    GithubIcon,
    BundlephobiaIcon,
    NpmIcon,
    ThoughtworksIcon,
  },

  props: {
    libName: {
      type: String,
      required: true,
    },
    repoUrl: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const { libName } = toRefs(props);
    const npmUrl = computed(
      () => `https://www.npmjs.com/package/${encodeURIComponent(libName.value)}`
    );
    const bundlephobiaUrl = computed(() => getBundlephobiaUrl(libName.value));
    const thoughtworksUrl = computed<string | null>(
      () => libsToLinkMap[libName.value] || null
    );

    return {
      npmUrl,
      bundlephobiaUrl,
      thoughtworksUrl,
    };
  },
});
</script>
