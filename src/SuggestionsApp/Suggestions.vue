<template>
  <div v-if="suggestions.length">
    <div>
      <SuggestionItem
        v-for="suggestedLibrary in suggestions"
        :key="suggestedLibrary.id"
        :catalog-library="suggestedLibrary"
        @select="onSelect"
      />
      <span
        v-if="hasMore"
        class="link mt-2 inline-block rounded border border-primary px-1"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { getSuggestions } from '@/suggestionsHelper';
import { CatalogLibraryT } from '@/data/index';
import { $trimmedLibraries } from '@/nanostore/trimmedLibraries';
import SuggestionItem from './SuggestionItem.vue';
import ChevronDownIcon from '@/icons/ChevronDownIcon.vue';
import ChevronUpIcon from '@/icons/ChevronUpIcon.vue';

// The Number of Suggestions shown in the "SHOW LESS" mode
const size = 5;

const emit = defineEmits(['select']);

const showAll = ref(false);

const allSuggestions = ref<CatalogLibraryT[]>([]);

$trimmedLibraries.subscribe((trimmedLibraries) => {
  allSuggestions.value = getSuggestions(trimmedLibraries);
});

const hasMore = computed<boolean>(() => allSuggestions.value.length > size);

const suggestions = computed<CatalogLibraryT[]>(() =>
  showAll.value ? allSuggestions.value : allSuggestions.value.slice(0, size)
);

function onSelect(catalogLibrary: CatalogLibraryT) {
  if (catalogLibrary.npm) {
    emit('select', catalogLibrary.npm, true);
  } else {
    emit('select', catalogLibrary.repoId, false);
  }
}
</script>
