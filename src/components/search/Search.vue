<template>
  <div>
    <div>
      <!-- progressbar -->
      <div
        class="relative w-full h-1 overflow-hidden rounded-full indeterminate"
      >
        <div
          v-if="isLoading"
          class="absolute top-0 h-full rounded-full bg-primary progressbar"
          :style="{ width: `80%` }"
        >
          <span class="flex items-center h-full"><slot></slot></span>
        </div>
      </div>

      <div class="relative flex flex-wrap items-stretch w-full">
        <input
          id="lib-search"
          type="text"
          placeholder="Add npm packages to comparison"
          autofocus
          autocomplete="off"
          class="myinput"
          @input="onChange"
        />
        <span
          class="absolute right-0 z-10 flex items-center justify-end h-full py-3 pr-3 w-14"
        >
          <NpmIcon v-if="isNpmSearchRef" class="w-14" />
          <GithubIcon v-else class="w-8 h-8" />
        </span>
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
import { fetchNpmSearch, fetchGithubSearch } from './search-api';
import NpmIcon from '@/components/icons/Npm.vue';
import GithubIcon from '@/components/icons/Github.vue';

interface SearchItemT {
  isNpm: boolean;
  name: string;
  version?: string;
  description: string;
  stars?: number;
  updatedAt?: string;
  isArchived?: boolean;
}

type OptionT = SearchItemT & AutocompleteItem;

export default defineComponent({
  name: 'Search',

  components: {
    NpmIcon,
    GithubIcon,
  },
  emits: ['select'],

  setup(_props, { emit }) {
    const isError = ref(false);
    const isLoading = ref(false);
    const isNpmSearchRef = ref(true);
    let dataPromise: null | Promise<void> = null;

    onMounted(() => {
      autocomplete<OptionT>({
        input: document.getElementById('lib-search') as HTMLInputElement,
        debounceWaitMs: 200,

        fetch: (text: string, update: (items: SearchItemT[]) => void) => {
          const trimmedText = text.trim();
          let localPromise: Promise<void>;
          let isNpmSearch = !trimmedText.startsWith('g:');
          let q = isNpmSearch ? trimmedText : trimmedText.slice(2).trim();

          if (q.length < 1) {
            return;
          }

          isLoading.value = true;

          localPromise = dataPromise = isNpmSearch
            ? // NPM SEARCH
              fetchNpmSearch(q).then((searchItems): void => {
                isError.value = false;
                update(
                  searchItems.map((searchItem) => ({
                    ...searchItem,
                    isNpm: true,
                  }))
                );
              })
            : // GITHUB SEARCH
              fetchGithubSearch(q).then((searchItems) => {
                isError.value = false;
                update(
                  searchItems.map(({ repoId, description }) => ({
                    name: repoId,
                    description,
                    isNpm: false,
                  }))
                );
              });

          localPromise
            .catch(() => {
              isError.value = true;
            })
            .finally(() => {
              // We should remove loading indicator
              // only after last call resolved
              if (localPromise === dataPromise) {
                isLoading.value = false;
              }
            });
        },

        onSelect: (item: SearchItemT) => {
          emit('select', item.name, item.isNpm);
          (document.getElementById('lib-search') as HTMLInputElement).value =
            '';
        },

        className: 'ac',

        render(item) {
          const divWrapper = document.createElement('div');

          divWrapper.className = 'ac-option';

          const html = `
          <div class="ac-option-title-wrapper">
            <div class="ac-option-title">${item.name}</div>
            <div class="ac-option-version">${
              item.version ? item.version : ''
            }</div>
          </div>
          <div class="ac-option-desc">${
            item.description ? item.description : ''
          }</div>`;

          divWrapper.innerHTML = html;

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
      isNpmSearchRef,
      isLoading,
      isError,
      onChange(event: InputEvent) {
        // @ts-ignore
        const val = event.target.value as string;
        isNpmSearchRef.value = !val.startsWith('g:');
      },
    };
  },
});
</script>

<style lang="postcss">
.ac {
  @apply rounded rounded-t-none border border-t-0 border-primary border-opacity-60;
}
.ac > .ac-option {
  @apply h-auto px-5 py-1 sm:py-2 border-b border-primary border-opacity-20;
}
.ac > .ac-option.selected,
.ac > .ac-option:hover:not(.group) {
  @apply bg-black bg-opacity-10;
}
.ac-option-title-wrapper {
  @apply flex justify-between mb-0.5 items-center;
}
.ac-option-title {
  @apply text-black text-opacity-80 font-mono text-sm;
}
.ac-option-desc {
  @apply text-black text-opacity-70 font-light text-sm;
}
.ac-option-version {
  @apply text-black text-opacity-70 font-light text-sm;
}
.myinput {
  @apply bg-opacity-5 placeholder-opacity-60 ring-0 border border-primary border-opacity-40 relative w-full py-3 pl-3 pr-16 text-xl font-light text-gray-700 rounded outline-none md:text-2xl;
}
.myinput:focus {
  @apply bg-white ring-0 outline-none border-primary border;
}

@keyframes progress-indeterminate {
  0% {
    width: 30%;
    left: -40%;
  }
  60% {
    left: 100%;
    width: 100%;
  }
  to {
    left: 100%;
    width: 0;
  }
}
.progressbar {
  transition: width 0.25s ease;
}
.indeterminate .progressbar {
  animation: progress-indeterminate 1s ease infinite;
}
</style>
