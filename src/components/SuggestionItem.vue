<template>
  <a
    class="inline-block mt-2 mr-3 text-base"
    :href="getHrefForAdditionalLib(suggestedLibrary)"
    @click.prevent="$emit('select', suggestedLibrary)"
    >+ {{ suggestedLibrary.alias }}</a
  >
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { constructHref } from '@/utils';
import { CatalogLibraryT } from '@/data/index';
import { libraries } from '@/store/libraries';

export default defineComponent({
  name: 'SuggestionItem',

  props: {
    suggestedLibrary: {
      type: Object as PropType<CatalogLibraryT>,
      required: true,
    },
  },

  emits: ['select'],

  setup() {
    return {
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
