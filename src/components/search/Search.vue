<template>
  <div>
    <div>
      <div class="text-sm text-black text-opacity-70">
        <span class="underline">Hint</span>: start with "<span
          class="text-black text-opacity-80"
          >n:</span
        >" to search for npm packages
      </div>
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
          v-model="searchValue"
          type="text"
          placeholder="search for a GitHub repository"
          autofocus
          autocomplete="off"
          class="myinput"
        />
        <span
          class="absolute right-0 z-10 flex items-center justify-end h-full py-3 pr-3 w-14"
        >
          <NpmIcon v-if="isNpmSearch" class="w-14" />
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
import { defineComponent, onMounted, ref, computed } from 'vue';
import autocomplete, { AutocompleteItem } from 'autocompleter';
import { numbersFormatter } from '@/utils';
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
    const searchValue = ref('');
    const isNpmSearch = computed(() => searchValue.value.startsWith('n:'));
    const isError = ref(false);
    const isLoading = ref(false);
    let dataPromise: null | Promise<void> = null;

    onMounted(() => {
      autocomplete<OptionT>({
        input: document.getElementById('lib-search') as HTMLInputElement,
        debounceWaitMs: 200,

        fetch: (text: string, update: (items: SearchItemT[]) => void) => {
          const trimmedText = text.trim();
          let localPromise: Promise<void>;
          let q = isNpmSearch.value ? trimmedText.slice(2).trim() : trimmedText;

          if (q.length < 1) {
            return;
          }

          isLoading.value = true;

          localPromise = dataPromise = isNpmSearch.value
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
                  searchItems.map(({ repoId, description, stars }) => ({
                    name: repoId,
                    description,
                    stars,
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
          searchValue.value = '';
        },

        className: 'ac',

        render(item) {
          const divWrapper = document.createElement('div');

          divWrapper.className = 'ac-option';

          const stars = item.isNpm
            ? ''
            : `
              <span>&#9733;${numbersFormatter.format(
                item.stars as number
              )}</span>
          `;

          const html = `
          <!-- GitHub Icon -->
          <div class="ac-option-icon h-6 w-6 ${
            item.isNpm ? 'hidden' : 'block'
          }">
            <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <title>GitHub icon</title>
              <path
                class="icon"
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              />
            </svg>
          </div>

          <!-- Npm Icon -->
          <div class="ac-option-icon w-8 ${item.isNpm ? 'block' : 'hidden'}">
            <svg
              id="npm"
              class="icon"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              x="0px"
              y="0px"
              viewBox="0 0 780 250"
              style="enable-background: new 0 0 780 250"
              xml:space="preserve"
            >
              <path
                class="icon-path"
                d="M240,250h100v-50h100V0H240V250z M340,50h50v100h-50V50z M480,0v200h100V50h50v150h50V50h50v150h50V0H480z
             M0,200h100V50h50v150h50V0H0V200z"
              />
            </svg>
          </div>

          <div>
            <!-- Title -->
            <div class="text-black text-opacity-80 text-sm mb-0.5">
              <span class="font-mono">${item.name}</span>
              <span class="text-sm text-black text-opacity-60">${
                item.version ? '@' + item.version : ''
              }</span>
              <span class="ml-2 text-black text-opacity-60">${stars}</span>
            </div>

            <!-- Description -->
            <div class="text-sm font-light text-black text-opacity-70">${
              item.description ? item.description : ''
            }</div>           
          </div>
`;

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
      searchValue,
      isNpmSearch,
      isLoading,
      isError,
    };
  },
});
</script>

<style lang="postcss">
.ac {
  @apply rounded rounded-t-none border border-t-0 border-primary border-opacity-60;
}
.ac > .ac-option {
  @apply flex items-center h-auto pr-5 py-1 sm:py-2 border-b border-primary border-opacity-20;
}
.ac-option-icon {
  @apply mx-3 fill-current text-black text-opacity-60;
}
.ac > .ac-option.selected,
.ac > .ac-option:hover:not(.group) {
  @apply bg-black bg-opacity-10;
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
