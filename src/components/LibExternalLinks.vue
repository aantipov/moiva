<template>
  <div class="flex items-center h-5 space-x-3">
    <object
      v-if="hasNpm"
      :id="'badge-' + npm"
      :data="snykUrl"
      type="image/svg+xml"
    ></object>

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
    const npm = computed(() => library.value.npmPackage?.name || '');
    const snykUrl = computed(() =>
      library.value.npmPackage
        ? `https://snyk-widget.herokuapp.com/badge/npm/${encodeURIComponent(
            npm.value
          )}/badge.svg`
        : ''
    );

    return {
      hasNpm: computed(() => !!library.value.npmPackage),
      bundlephobiaUrl: computed(() => getBundlephobiaUrl(npm.value)),
      thoughtworksUrl: computed<string | null>(() => {
        const tradarItem =
          repoToTechRadarMap[library.value.repo.repoId] || null;
        return tradarItem && tradarItem.link;
      }),
      snykUrl,
      npm,
    };
  },
});
</script>
