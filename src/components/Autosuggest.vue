<template>
  <div class="relative flex flex-wrap items-stretch w-full">
    <input
      id="npm-input"
      type="text"
      placeholder="Add npm packages to comparison"
      autofocus
      class="relative w-full px-3 py-3 pr-10 text-lg text-gray-700 placeholder-gray-500 bg-white border border-gray-400 rounded outline-none focus:outline-none focus:border-3 focus:bg-gray-300"
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
import autocomplete, { AutocompleteItem } from 'autocompleter';
import 'autocompleter/autocomplete.css';
import { fetchNpmSuggestions, LibraryT } from '../apis';

type OptionT = LibraryT & AutocompleteItem;

export default Vue.extend({
  name: 'AutoSuggest',
  mounted() {
    autocomplete<OptionT>({
      input: document.getElementById('npm-input') as HTMLInputElement,
      debounceWaitMs: 200,
      fetch: (text: string, update: (items: LibraryT[]) => void) => {
        fetchNpmSuggestions(text).then((suggestions): void => {
          update(suggestions);
        });
      },
      onSelect: (item: LibraryT) => {
        this.$emit('select', item);
        (document.getElementById('npm-input') as HTMLInputElement).value = '';
      },
      className: 'ac',
      render(item) {
        const div = document.createElement('div');
        const divTitle = document.createElement('div');
        const divDescr = document.createElement('div');

        div.appendChild(divTitle);
        div.appendChild(divDescr);

        div.className = 'ac-option';
        divTitle.className = 'ac-option-title';
        divDescr.className = 'ac-option-desc';

        divTitle.textContent = item.name;
        divDescr.textContent = item.description;

        return div;
      },
      customize: function (input, inputRect, container, maxHeight) {
        if (maxHeight > 400) {
          container.style.maxHeight = '383px';
        }
      },
      preventSubmit: true,
      showOnFocus: true,
    });
  },
});
</script>

<style lang="postcss">
.ac {
  @apply rounded rounded-t-none border border-t-0 border-orange-300;
}
.ac > .ac-option {
  @apply h-12 px-5 border-b flex flex-col justify-center;
}
@screen sm {
  .ac > .ac-option {
    @apply h-16;
  }
}
.ac > .ac-option.selected,
.ac > .ac-option:hover:not(.group) {
  @apply bg-orange-300;
}
.ac-option-title {
  @apply h-5 overflow-hidden text-gray-800 font-normal text-base;
}
.ac-option-desc {
  @apply h-5 overflow-hidden text-gray-600 font-normal text-xs;
}
</style>
