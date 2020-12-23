<template>
  <div class="relative flex flex-wrap items-stretch w-full">
    <input
      id="npm-input"
      type="text"
      placeholder="Add npm packages to comparison"
      autofocus
      autocomplete="off"
      class="relative w-full px-3 py-3 pr-10 text-xl font-light text-gray-700 placeholder-gray-400 bg-gray-100 border border-transparent rounded outline-none md:text-2xl focus:bg-white focus:border-gray-400 focus:ring-0 focus:outline-none focus:border-3"
    />
    <span
      class="absolute right-0 z-10 items-center justify-center w-8 h-full py-3 pr-3 text-base font-normal leading-snug text-center text-gray-400 bg-transparent rounded"
    >
      <i class="fas fa-user"></i>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import autocomplete, { AutocompleteItem } from 'autocompleter';
import 'autocompleter/autocomplete.css';
import { fetchNpmSuggestions, LibraryT } from '../apis';

type OptionT = LibraryT & AutocompleteItem;

export default defineComponent({
  name: 'AutoSuggest',
  emits: ['select', 'success', 'error'],

  mounted() {
    autocomplete<OptionT>({
      input: document.getElementById('npm-input') as HTMLInputElement,
      debounceWaitMs: 200,

      fetch: (text: string, update: (items: LibraryT[]) => void) => {
        fetchNpmSuggestions(text)
          .then((suggestions): void => {
            this.$emit('success');
            update(suggestions);
          })
          .catch(() => {
            this.$emit('error');
          });
      },

      onSelect: (item: LibraryT) => {
        this.$emit('select', item);
        (document.getElementById('npm-input') as HTMLInputElement).value = '';
      },

      className: 'ac',

      render(item) {
        const divWrapper = document.createElement('div');
        const divTitleWrapper = document.createElement('div');
        const divTitle = document.createElement('div');
        const divDescr = document.createElement('div');
        const divVersion = document.createElement('div');

        divTitleWrapper.appendChild(divTitle);
        divTitleWrapper.appendChild(divVersion);
        divWrapper.appendChild(divTitleWrapper);
        divWrapper.appendChild(divDescr);

        divWrapper.className = 'ac-option';
        divTitleWrapper.className = 'ac-option-title-wrapper';
        divTitle.className = 'ac-option-title';
        divDescr.className = 'ac-option-desc';
        divVersion.className = 'ac-option-version';

        divTitle.textContent = item.name;
        divDescr.textContent = item.description;
        divVersion.textContent = item.version;

        return divWrapper;
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
  @apply rounded rounded-t-none border border-t-0 border-gray-400;
}
.ac > .ac-option {
  @apply h-auto px-5 py-1 sm:py-2 border-b;
}
.ac > .ac-option.selected,
.ac > .ac-option:hover:not(.group) {
  @apply bg-gray-200;
}
.ac-option-title-wrapper {
  @apply flex justify-between mb-0.5 items-center;
}
.ac-option-title {
  @apply text-gray-800 font-mono text-sm;
}
.ac-option-desc {
  @apply text-gray-500 font-light text-sm;
}
.ac-option-version {
  @apply text-gray-500 font-light text-sm hidden;
}
</style>
