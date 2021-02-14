<template>
  <div v-if="hasNpm || thoughtworksUrl" class="flex items-center h-5 space-x-3">
    <object
      v-if="hasNpm"
      :id="'badge-' + npm"
      v-tooltip="'Snyk Security Score badge. \'A\' means no vulnerabilities.'"
      :data="snykUrl"
      type="image/svg+xml"
      style="max-width: 131px; max-height: 20px"
    ></object>

    <img
      v-if="hasNpm && library.npmPackage.hasBuiltinTypes"
      v-tooltip="'This package contains built-in TypeScript declarations'"
      src="/images/ts.svg"
      height="20"
      width="20"
      alt="TypeScript icon, indicating that this package has built-in type declarations"
    />

    <img
      v-else-if="hasNpm && library.npmPackage.hasOtherTypes"
      v-tooltip="
        `This package has TypeScript declarations provided by the separate ${library.npmPackage.otherTypesPackageName} package`
      "
      src="/images/ts-dt.svg"
      height="20"
      width="20"
      :alt="`DefinitelyTyped icon, indicating that this package has TypeScript declarations provided by the separate ${library.npmPackage.otherTypesPackageName} package`"
    />

    <a
      v-if="thoughtworksUrl"
      v-tooltip="'ThoughtWorks Technology Radar page'"
      :href="thoughtworksUrl"
      target="_blank"
      class="inline-block"
    >
      <ThoughtworksIcon class="w-5 sm:w-6" />
    </a>

    <a
      v-if="hasNpm"
      v-tooltip="'Bundlephobia page'"
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
import { LibraryT } from '@/libraryApis';
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
