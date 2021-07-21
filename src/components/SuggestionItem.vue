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

      <div v-if="isLoading" class="my-1">Loading...</div>

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
      <div class="flex mt-2">
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

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  ref,
  toRefs,
} from 'vue';
import { constructHref, numbersFormatter } from '@/utils';
import { CatalogLibraryT } from '@/data/index';
import { libraries } from '@/store/libraries';
import { fetchLibraryByNpm, fetchLibraryByRepo } from '@/libraryApis';
import { fetchNpmDownloads } from '@/components/downloads/api';
import tippy, { roundArrow } from 'tippy.js';
import { LibraryT } from '@/getLibrary';

export default defineComponent({
  name: 'SuggestionItem',

  props: {
    catalogLibrary: {
      type: Object as PropType<CatalogLibraryT>,
      required: true,
    },
  },

  emits: ['select'],

  setup(props) {
    const { catalogLibrary } = toRefs(props);
    const contentRef = ref(null);
    const triggerRef = ref(null);
    const isLoading = ref(false);
    let lib = ref<LibraryT | null>(null);

    async function fetchData() {
      isLoading.value = true;
      if (catalogLibrary.value.npm) {
        lib.value = await fetchLibraryByNpm(catalogLibrary.value.npm);
      } else {
        lib.value = await fetchLibraryByRepo(catalogLibrary.value.repoId);
      }
      isLoading.value = false;
    }

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
            fetchData();
            if (catalogLibrary.value.npm) {
              fetchNpmDownloads(catalogLibrary.value.npm);
            }
          }
        },
      });
    });

    return {
      lib,
      isLoading,
      triggerRef,
      contentRef,
      stars: computed(() =>
        numbersFormatter.format(lib.value?.repo.stars as number)
      ),
      downloads: computed(() =>
        numbersFormatter.format(lib.value?.npmDownloadsAvg as number)
      ),

      getHrefForAdditionalLib(catalogLibrary: CatalogLibraryT): string {
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
          return constructHref(
            [...npmPackagesNames, catalogLibrary.npm],
            reposIds
          );
        }

        return constructHref(npmPackagesNames, [
          ...reposIds,
          catalogLibrary.repoId,
        ]);
      },
    };
  },
});
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
