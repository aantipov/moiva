<template>
  <div class="inline-block">
    <a
      ref="triggerRef"
      class="inline-block mt-2 mr-3 text-base"
      :href="getHrefForAdditionalLib(suggestedLibrary)"
      @click.prevent="$emit('select', suggestedLibrary)"
      >+ {{ suggestedLibrary.alias }}</a
    >
    <div ref="contentRef" class="">
      <div v-if="isLoading">Loading...</div>
      <div v-else>
        {{ lib?.npmPackage?.description || lib?.repo.description }}
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
import { constructHref } from '@/utils';
import { CatalogLibraryT } from '@/data/index';
import { libraries } from '@/store/libraries';
import { fetchLibraryByNpm, fetchLibraryByRepo } from '@/libraryApis';
import tippy, { Instance } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/dist/backdrop.css';
import { LibraryT } from '@/getLibrary';

export default defineComponent({
  name: 'SuggestionItem',

  props: {
    suggestedLibrary: {
      type: Object as PropType<CatalogLibraryT>,
      required: true,
    },
  },

  emits: ['select'],

  setup(props) {
    const { suggestedLibrary } = toRefs(props);
    const contentRef = ref(null);
    const triggerRef = ref(null);
    let lib = ref<LibraryT | null>(null);
    let t: Instance;

    async function fetchData() {
      lib.value = await fetchLibraryByNpm(suggestedLibrary.value.npm as string);
    }

    onMounted(() => {
      tippy(triggerRef.value as unknown as HTMLElement, {
        content: contentRef.value as unknown as HTMLElement,
        delay: [400, 50],
        interactive: true,
        allowHTML: true,
        // theme: 'chart-menu',
        hideOnClick: true,
        onShow() {
          if (!lib.value) {
            fetchData();
          }
        },
      });
    });

    return {
      lib,
      isLoading: computed(() => !lib.value),
      triggerRef,
      contentRef,
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

<style lang="postcss"></style>
