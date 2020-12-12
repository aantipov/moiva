<template>
  <div class="relative flex flex-wrap items-stretch w-full mb-3">
    <input
      id="country"
      type="text"
      placeholder="Add npm packages to comparison"
      class="relative w-full px-3 py-3 pr-10 text-sm text-gray-700 placeholder-gray-400 bg-white border border-gray-400 rounded outline-none focus:outline-none focus:shadow-outline"
    />
    <span
      class="absolute right-0 z-10 items-center justify-center w-8 h-full py-3 pr-3 text-base font-normal leading-snug text-center text-gray-400 bg-transparent rounded"
    >
      <i class="fas fa-user"></i>
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import autocomplete from 'autocompleter';
import 'autocompleter/autocomplete.css';
import { fetchNpmSuggestions, NpmSuggestionT } from '../apis';

export default Vue.extend({
  name: 'AutoSuggest',
  mounted() {
    console.log('mounted');

    autocomplete<NpmSuggestionT>({
      input: document.getElementById('country') as HTMLInputElement,
      emptyMsg: 'No items found',
      minLength: 1,
      fetch: (text: string, update: (items: NpmSuggestionT[]) => void) => {
        console.log('fetch', text);
        fetchNpmSuggestions(text).then((suggestions): void => {
          update(suggestions);
        });
      },
      onSelect: (item: NpmSuggestionT) => {
        console.log('onSelect', item);
        this.$emit('select', item.value);
        // input.value = item.label;
      },
    });
  },
});
</script>
