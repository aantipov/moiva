<template>
  <div class="inline-block">
    <a
      ref="triggerRef"
      class="inline-block mt-2 mr-3 text-base"
      :href="getHrefForAdditionalLib(catalogLibrary)"
      @click.prevent="$emit('select', catalogLibrary)"
      >+ {{ catalogLibrary.alias }}</a
    >
    <div ref="contentRef">
      <!-- Name -->
      <div class="mb-1">
        <div v-if="catalogLibrary.npm" class="flex">
          <m-npm-icon class="mr-2" />
          <span class="font-mono">{{ catalogLibrary.npm }}</span>
        </div>
        <div v-else class="flex items-center">
          <m-github-icon class="mr-2" />
          <span class="font-mono">{{ catalogLibrary.repoId }}</span>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center my-3">
        <m-loader-tail-spin />
      </div>

      <!-- Description + stats -->
      <template v-else>
        <div class="mb-1">
          {{ lib?.npmPackage?.description || lib?.repo.description }}
        </div>

        <div class="flex text-sm">
          <div class="flex items-center font-normal">
            <m-star-icon />
            {{ stars }}
          </div>
          <div
            v-if="lib?.npmDownloadsAvg"
            class="flex items-center font-normal ml-3"
          >
            <m-download-icon />
            {{ downloads }}/mo
          </div>
        </div>
      </template>

      <!-- Tags -->
      <div class="flex flex-wrap mt-2">
        <div
          v-for="tag in catalogLibrary.tags"
          :key="tag"
          class="
            flex
            justify-center
            items-center
            rounded-full
            border border-blue-300
            bg-blue-200
            m-1
            px-2
          "
        >
          {{ tag }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, PropType, ref } from 'vue';
import { constructHref, numbersFormatter } from '@/utils';
import { CatalogLibraryT } from '@/data/index';
import { libraries } from '@/store/libraries';
import { fetchLibraryByNpm, fetchLibraryByRepo } from '@/libraryApis';
import { fetchNpmDownloads } from '@/components/downloads/api';
import tippy, { roundArrow } from 'tippy.js';
import { LibraryT } from '@/getLibrary';

defineEmits(['select']);

const props = defineProps({
  catalogLibrary: {
    type: Object as PropType<CatalogLibraryT>,
    required: true,
  },
});

const contentRef = ref(null);
const triggerRef = ref(null);
const isLoading = ref(false);
let lib = ref<LibraryT | null>(null);

onMounted(() => {
  tippy(triggerRef.value as unknown as HTMLElement, {
    content: contentRef.value as unknown as HTMLElement,
    // concatenates the two SVG strings together to style Arrow border
    arrow: roundArrow + roundArrow,
    delay: [200, 50],
    interactive: false,
    allowHTML: true,
    theme: 'suggestion-tp',
    hideOnClick: true,
    onShow() {
      if (!lib.value && !isLoading.value) {
        _fetchData();
        if (props.catalogLibrary.npm) {
          fetchNpmDownloads(props.catalogLibrary.npm);
        }
      }
    },
  });
});

const stars = computed(() =>
  numbersFormatter.format(lib.value?.repo.stars as number)
);
const downloads = computed(() =>
  numbersFormatter.format(lib.value?.npmDownloadsAvg as number)
);

function getHrefForAdditionalLib(catalogLibrary: CatalogLibraryT): string {
  const npmPackagesNames = [] as string[];
  const reposIds = [] as string[];

  libraries.forEach((library) => {
    if (library.npmPackage) {
      npmPackagesNames.push(library.npmPackage.name);
    } else {
      reposIds.push(library.repo.repoId);
    }
  });

  if (catalogLibrary.npm) {
    return constructHref([...npmPackagesNames, catalogLibrary.npm], reposIds);
  }

  return constructHref(npmPackagesNames, [...reposIds, catalogLibrary.repoId]);
}

async function _fetchData() {
  isLoading.value = true;
  if (props.catalogLibrary.npm) {
    lib.value = await fetchLibraryByNpm(props.catalogLibrary.npm);
  } else {
    lib.value = await fetchLibraryByRepo(props.catalogLibrary.repoId);
  }
  isLoading.value = false;
}
</script>

<style lang="postcss">
.tippy-box[data-theme~='suggestion-tp'] {
  @apply bg-gray-200 border border-gray-300 shadow-md;
}
.tippy-box[data-theme~='suggestion-tp'] .tippy-content {
  @apply text-base text-gray-800;
}
.tippy-box[data-theme~='suggestion-tp'] .menu-item {
  @apply whitespace-nowrap text-xl sm:text-base py-2 px-2 hover:bg-gray-600 hover:text-white;
}
/* Arrow border */
.tippy-box[data-theme~='suggestion-tp'] > .tippy-svg-arrow > svg:first-child {
  fill: black;
}
/* Arrow fill */
.tippy-box[data-theme~='suggestion-tp'] > .tippy-svg-arrow > svg:last-child {
  @apply fill-current text-gray-200;
}
</style>
