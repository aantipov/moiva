<template>
  <div v-if="suggestions.length" class="w-full px-3 mx-auto lg:w-9/12 xl:w-2/4">
    <div>
      <a
        v-for="suggestedLibrary in suggestions"
        :key="suggestedLibrary.repoId"
        class="inline-block mt-2 mr-3 text-base"
        :href="getHrefForAdditionalLib(suggestedLibrary)"
        @click.prevent="onSelect(suggestedLibrary)"
        >+ {{ suggestedLibrary.alias }}</a
      >
      <span
        v-if="hasMore"
        class="inline-block px-1 mt-2 border rounded link border-primary"
        @click="showAll = !showAll"
      >
        <template v-if="!showAll"
          ><ChevronDownIcon class="inline-block w-6 h-6 align-bottom" /> Show
          More
        </template>
        <template v-else>
          <ChevronUpIcon class="inline-block w-6 h-6 align-top" /> Show Less
        </template>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';
import { getSuggestions, constructHref } from '@/utils';
import { CatalogLibraryT } from '@/data/index';
import { libraries } from '@/store/libraries';
import ChevronDownIcon from '@/components/icons/ChevronDown.vue';
import ChevronUpIcon from '@/components/icons/ChevronUp.vue';

// The Number of Suggestions shown in the "SHOW LESS" mode
const size = 5;

export default defineComponent({
  name: 'Suggestions',

  components: {
    ChevronDownIcon,
    ChevronUpIcon,
  },

  emits: ['select'],

  setup(_props, { emit }) {
    const showAll = ref(false);
    const allSuggestions = computed<CatalogLibraryT[]>(() =>
      getSuggestions(libraries)
    );

    return {
      showAll,
      hasMore: computed<boolean>(() => allSuggestions.value.length > size),
      suggestions: computed<CatalogLibraryT[]>(() =>
        showAll.value
          ? allSuggestions.value
          : allSuggestions.value.slice(0, size)
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
