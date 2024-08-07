<template>
  <div class="inline-block">
    <span
      ref="triggerRef"
      class="mr-1 mt-2 inline-block rounded px-1 text-base"
      :class="{
        'cursor-not-allowed border border-primary bg-primary/70 text-white shadow-none':
          isLibLoading,
        'cursor-pointer text-primary hover:bg-black/10 hover:underline hover:shadow-md active:bg-black/20 active:shadow-none':
          !isLibLoading,
      }"
      @click.prevent="$emit('select', catalogLibrary)"
      >+ {{ catalogLibrary.npm }}</span
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
      <div v-if="isLoading" class="my-3 flex justify-center">
        <LoaderTailSpin />
      </div>

      <!-- Description + stats -->
      <template v-else>
        <div class="mb-1">
          {{ lib?.npm.description || lib?.repo?.description || '' }}
        </div>

        <div class="flex text-sm">
          <div v-if="stars" class="flex items-center font-normal">
            <m-star-icon />
            {{ stars }}
          </div>
          <div
            v-if="lib?.npmDownloadsAvg"
            class="ml-3 flex items-center font-normal"
          >
            <m-download-icon />
            {{ downloads }}/mo
          </div>
        </div>
      </template>

      <!-- Tags -->
      <div class="mt-2 flex flex-wrap">
        <div
          v-for="tag in catalogLibrary.tags"
          :key="tag"
          class="m-1 flex items-center justify-center rounded-full border border-blue-300 bg-blue-200 px-2"
        >
          {{ tag }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoaderTailSpin from '@/components/LoaderTailSpin.vue';
import { computed, onMounted, type PropType, ref } from 'vue';
import { numbersFormatter } from '@/utils';
import { type CatalogLibraryT } from '@/data/index';
import { fetchLibraryByNpm } from '@/libraryApis';
import { fetchNpmDownloads } from '@/components/downloads/api';
import tippy, { roundArrow } from 'tippy.js';
import { type LibraryT } from '@/getLibrary';

defineEmits(['select']);

const props = defineProps({
  catalogLibrary: {
    type: Object as PropType<CatalogLibraryT>,
    required: true,
  },
  isLibLoading: {
    type: Boolean,
    default: false,
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
  lib.value?.repo?.stars
    ? numbersFormatter.format(lib.value?.repo.stars as number)
    : null,
);
const downloads = computed(() =>
  numbersFormatter.format(lib.value?.npmDownloadsAvg as number),
);

async function _fetchData() {
  isLoading.value = true;
  lib.value = await fetchLibraryByNpm(props.catalogLibrary.npm);
  isLoading.value = false;
}
</script>

<style lang="postcss">
.tippy-box[data-theme~='suggestion-tp'] {
  @apply border border-gray-300 bg-gray-200 shadow-md;
}
.tippy-box[data-theme~='suggestion-tp'] .tippy-content {
  @apply text-base text-gray-800;
}
.tippy-box[data-theme~='suggestion-tp'] .menu-item {
  @apply whitespace-nowrap px-2 py-2 text-xl hover:bg-gray-600 hover:text-white sm:text-base;
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
