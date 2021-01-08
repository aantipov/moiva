<template>
  <div class="flex items-center">
    <a :href="npmUrl" target="_blank" class="inline-block mr-4">
      <NpmIcon class="w-10 sm:w-12" />
    </a>

    <a :href="repoUrl" target="_blank" class="inline-block mr-4">
      <GithubIcon class="w-5 h-5 sm:w-6 sm:h-6" />
    </a>

    <a :href="bundlephobiaUrl" target="_blank" class="inline-block mr-4">
      <BundlephobiaIcon class="w-5 sm:w-6" />
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import GithubIcon from './icons/Github.vue';
import BundlephobiaIcon from './icons/Bundlephobia.vue';
import NpmIcon from './icons/Npm.vue';

export default defineComponent({
  name: 'LibExternalLinks',

  components: {
    GithubIcon,
    BundlephobiaIcon,
    NpmIcon,
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
    const bundlephobiaUrl = computed(
      () =>
        `https://bundlephobia.com/result?p=${encodeURIComponent(libName.value)}`
    );

    return {
      npmUrl,
      bundlephobiaUrl,
    };
  },
});
</script>
