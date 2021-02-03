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

    <a
      v-if="hasNpm"
      :href="bundlephobiaUrl"
      target="_blank"
      class="inline-block"
    >
      <BundlephobiaIcon class="w-5 sm:w-6" />
    </a>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import BundlephobiaIcon from './icons/Bundlephobia.vue';
import ThoughtworksIcon from './icons/Thoughtworks.vue';
import { LibraryT, NpmPackageT } from '@/libraryApis';
import { repoToTechRadarMap } from '../../techradar.config';
import { getBundlephobiaUrl } from '@/utils';

export default defineComponent({
  name: 'LibExternalLinks',

  components: {
    BundlephobiaIcon,
    ThoughtworksIcon,
  },

  props: {
    library: { type: Object as () => LibraryT, required: true },
  },

  setup(props) {
    const { library } = toRefs(props);

    return {
      hasNpm: computed(() => !!library.value.npmPackage),
      bundlephobiaUrl: computed(() =>
        getBundlephobiaUrl((library.value.npmPackage as NpmPackageT).name)
      ),
      thoughtworksUrl: computed<string | null>(() => {
        const tradarItem =
          repoToTechRadarMap[library.value.repo.repoId] || null;
        return tradarItem && tradarItem.link;
      }),
    };
  },
});
</script>
