<template>
  <div class="inline-block">
    <a
      ref="triggerRef"
      class="inline-block mt-2 mr-3 text-base"
      :href="getHrefForAdditionalLib(catalogLibrary)"
      @click.prevent="$emit('select', catalogLibrary)"
      >+ {{ catalogLibrary.alias }}</a
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
import { defineComponent, onMounted, PropType, ref, toRefs } from 'vue';
import { constructHref } from '@/utils';
import { CatalogLibraryT } from '@/data/index';
import { libraries } from '@/store/libraries';
import { fetchLibraryByNpm, fetchLibraryByRepo } from '@/libraryApis';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/dist/backdrop.css';
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
        delay: [400, 50],
        interactive: true,
        allowHTML: true,
        hideOnClick: true,
        onShow() {
          if (!lib.value && !isLoading.value) {
            fetchData();
          }
        },
      });
    });

    return {
      lib,
      isLoading,
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
