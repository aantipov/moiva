<template>
  <div v-if="suggestions.length">
    <div>
      <LibraryItem
        v-for="lib in trimmedLibraries"
        :key="lib.id"
        :library="lib"
        @select="onRemove"
      />
      <SuggestionItem
        v-for="suggestedLibrary in suggestions"
        :key="suggestedLibrary.id"
        :catalog-library="suggestedLibrary"
        @select="onSelect"
      />
      <span
        v-if="hasMore"
        class="link mt-2 inline-block rounded border border-primary px-1 hover:bg-black/10"
        @click="showAll = !showAll"
      >
        <template v-if="!showAll"
          ><ChevronDownIcon class="inline-block h-6 w-6 align-bottom" /> Show
          More
        </template>
        <template v-else>
          <ChevronUpIcon class="inline-block h-6 w-6 align-top" /> Show Less
        </template>
      </span>

      <a
        v-if="trimmedLibraries.length > 1"
        class="link mt-2 ml-1 inline-block rounded border border-primary px-1 hover:bg-black/10"
        href="/"
      >
        Clear selection
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { getSuggestions } from '@/suggestionsHelper';
import { CatalogLibraryT } from '@/data/index';
import {
  $trimmedLibraries,
  TrimmedLibraryT,
} from '@/nanostore/trimmedLibraries';
import { useStore } from '@nanostores/vue';
import SuggestionItem from './SuggestionItem.vue';
import LibraryItem from './LibraryItem.vue';
import ChevronDownIcon from '@/icons/ChevronDownIcon.vue';
import ChevronUpIcon from '@/icons/ChevronUpIcon.vue';

import {
  $addedNpmPackage,
  $addedRepo,
  $removedLibrary,
} from '@/nanostore/crudLibrary';

// The Number of Suggestions shown in the "SHOW LESS" mode
const size = 5;
const showAll = ref(false);
const trimmedLibraries = useStore($trimmedLibraries);
const allSuggestions = computed<CatalogLibraryT[]>(() =>
  getSuggestions(trimmedLibraries.value)
);

const hasMore = computed<boolean>(() => allSuggestions.value.length > size);

const suggestions = computed<CatalogLibraryT[]>(() =>
  showAll.value ? allSuggestions.value : allSuggestions.value.slice(0, size)
);

function onSelect(catalogLibrary: CatalogLibraryT) {
  if (catalogLibrary.npm) {
    $addedNpmPackage.set(catalogLibrary.npm);
  } else {
    $addedRepo.set(catalogLibrary.repoId);
  }
}
function onRemove(catalogLibrary: TrimmedLibraryT) {
  $removedLibrary.set(catalogLibrary.id);
}
</script>
