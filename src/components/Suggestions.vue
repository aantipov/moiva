<template>
  <div class="w-full px-3 mx-auto lg:w-9/12 xl:w-2/4">
    <a
      v-for="suggestedLibrary in suggestions"
      :key="suggestedLibrary.repoId"
      class="inline-block mt-2 mr-3 text-base"
      :href="getHrefForAdditionalLib(suggestedLibrary)"
      @click.prevent="onSelect(suggestedLibrary)"
      >+ {{ suggestedLibrary.alias }}</a
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { getSuggestions, constructHref } from '@/utils';
import { CatalogLibraryT } from '@/libraries-catalog';
import { libraries } from '@/store/libraries';
import { LibraryT } from '@/libraryApis';

export default defineComponent({
  name: 'Suggestions',

  emits: ['select'],

  setup(_props, { emit }) {
    return {
      suggestions: computed<CatalogLibraryT[]>(() =>
        getSuggestions(libraries as LibraryT[])
      ),
      onSelect(catalogLibrary: CatalogLibraryT) {
        if (catalogLibrary.npm) {
          emit('select', catalogLibrary.npm, true);
        } else {
          emit('select', catalogLibrary.repoId, false);
        }
      },
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
