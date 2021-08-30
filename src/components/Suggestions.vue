<template>
  <div v-if="suggestions.length" class="w-full px-3 mx-auto lg:w-9/12 xl:w-2/4">
    <div>
      <SuggestionItem
        v-for="suggestedLibrary in suggestions"
        :key="suggestedLibrary.repoId"
        :catalog-library="suggestedLibrary"
        @select="onSelect"
      />
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

<script setup lang="ts">
import { computed, ref } from 'vue';
import { getSuggestions } from '@/utils';
import { CatalogLibraryT } from '@/data/index';
import { libraries } from '@/store/libraries';
import SuggestionItem from './SuggestionItem.vue';
import ChevronDownIcon from '@/icons/ChevronDownIcon.vue';
import ChevronUpIcon from '@/icons/ChevronUpIcon.vue';

// The Number of Suggestions shown in the "SHOW LESS" mode
const size = 5;

const emit = defineEmits(['select']);

const showAll = ref(false);

const allSuggestions = computed<CatalogLibraryT[]>(() =>
  getSuggestions(libraries)
);

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

<style lang="postcss"></style>
