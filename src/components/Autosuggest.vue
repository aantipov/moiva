<template>
  <div>
    <div class="relative">
      <input
        id="npm-input"
        type="text"
        placeholder="Add npm packages to comparison"
        autofocus
        autocomplete="off"
        class="relative w-full py-3 pl-3 text-xl font-light text-gray-700 placeholder-gray-400 bg-gray-100 border border-transparent rounded outline-none pr-11 md:text-2xl focus:bg-white focus:border-gray-400 focus:ring-0 focus:outline-none focus:border-3"
      />

      <div
        class="absolute top-0 right-0 z-10 flex items-center justify-center w-8 h-full py-1 pr-4"
      >
        <m-loader-tail-spin v-if="isLoading" />
      </div>
    </div>

    <div v-if="isError" class="mt-2 text-red-600">
      Sorry, we couldn't fetch suggestions. Try another search
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import autocomplete, { AutocompleteItem } from 'autocompleter';
import 'autocompleter/autocomplete.css';
import { fetchNpmSuggestions, SuggestionT } from '../apis';

type OptionT = SuggestionT & AutocompleteItem;

export default defineComponent({
  name: 'AutoSuggest',
  emits: ['select', 'success', 'error'],

  setup(_props, { emit }) {
    const isError = ref(false);
    const isLoading = ref(false);
    let dataPromise: null | Promise<void> = null;

    onMounted(() => {
      autocomplete<OptionT>({
        input: document.getElementById('npm-input') as HTMLInputElement,
        debounceWaitMs: 200,

        fetch: (text: string, update: (items: SuggestionT[]) => void) => {
          isLoading.value = true;

          const localPromise = (dataPromise = fetchNpmSuggestions(text)
            .then((suggestions): void => {
              emit('success');
              isError.value = false;
              update(suggestions);
            })
            .catch(() => {
              emit('error');
              isError.value = true;
            })
            .finally(() => {
              // We should remove loading indicator
              // only after last call resolved
              if (localPromise === dataPromise) {
                isLoading.value = false;
              }
            }));
        },

        onSelect: (item: SuggestionT) => {
          emit('select', item.name);
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
    });

    return {
      isLoading,
      isError,
    };
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
  @apply bg-yellow-100;
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
  @apply text-gray-500 font-light text-sm;
}
</style>
