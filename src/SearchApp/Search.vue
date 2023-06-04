<template>
  <div>
    <div>
      <!-- progressbar for non-mobile screens -->
      <div
        class="indeterminate relative hidden h-1 w-full overflow-hidden rounded-full sm:block"
      >
        <div
          v-if="isLoading"
          class="progressbar absolute top-0 h-full rounded-full bg-primary"
          :style="{ width: `80%` }"
        >
          <span class="flex h-full items-center"><slot></slot></span>
        </div>
      </div>

      <div class="w-full sm:flex">
        <!--   GitHub/NPM switch       -->
        <div class="w-full sm:w-auto relative mb-2 inline-flex sm:mb-0">
          <ChevronDownIcon
            class="pointer-events-none absolute top-0 right-0 mx-2 my-2 h-6 w-6 text-white"
          />
          <select
            v-model="searchType"
            class="select"
            @change="() => inputRef.focus()"
          >
            <option value="NPM">NPM</option>
            <option value="GITHUB">GitHub</option>
          </select>
        </div>

        <!-- progressbar for mobile screens -->
        <div
          class="indeterminate relative h-1 w-full overflow-hidden rounded-full sm:hidden"
        >
          <div
            v-if="isLoading"
            class="progressbar absolute top-0 h-full rounded-full bg-primary"
            :style="{ width: `80%` }"
          >
            <span class="flex h-full items-center"><slot></slot></span>
          </div>
        </div>

        <!-- Search Input -->
        <div class="relative flex-grow">
          <input
            id="lib-search"
            ref="inputRef"
            v-model="searchValue"
            type="text"
            :placeholder="
              isNpmSearch
                ? 'search for NPM packages'
                : 'search for GitHub repositories'
            "
            autofocus
            autocomplete="off"
            class="myinput"
            @focus="isFocused = true"
            @blur="isFocused = false"
          />
          <button
            v-if="searchValue"
            class="absolute top-0 right-0 z-10 flex h-full w-14 items-center justify-end py-3 pr-3 focus:outline-none"
            @click="searchValue = ''"
          >
            <m-close class="h-6 w-6 opacity-80" />
          </button>
        </div>
      </div>
    </div>

    <div v-if="isError" class="mt-2 text-red-600">
      Sorry, we couldn't fetch suggestions. Try another search
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import autocomplete, { AutocompleteItem } from 'autocompleter';
import { numbersFormatter, sanitizeHTML } from '@/utils';
import 'autocompleter/autocomplete.css';
import { fetchNpmSearch, fetchGithubSearch } from './search-api';
import ChevronDownIcon from '@/icons/ChevronDownIcon.vue';

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

const emit = defineEmits(['select']);

const searchValue = ref('');
const searchType = ref<'GITHUB' | 'NPM'>('NPM');
const isNpmSearch = computed(() => searchType.value === 'NPM');
const isError = ref(false);
const isLoading = ref(false);
const isFocused = ref(true);
let dataPromise: null | Promise<void> = null;

onMounted(() => {
  autocomplete<OptionT>({
    input: document.getElementById('lib-search') as HTMLInputElement,
    debounceWaitMs: 200,

    fetch: (text: string, update: (_items: SearchItemT[]) => void) => {
      const q = text.trim();
      let localPromise: Promise<void>;

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
              item.description ? sanitizeHTML(item.description) : ''
            }</div>           
          </div>
          `;

      divWrapper.innerHTML = html;

      return divWrapper;
    },

    customize(input, inputRect, container, maxHeight) {
      if (maxHeight > 400) {
        container.style.maxHeight = '383px';
      }
    },
    preventSubmit: true,
    showOnFocus: true,
  });
});

const inputRef = ref<HTMLInputElement>(null as unknown as HTMLInputElement);
</script>

<style lang="postcss">
.ac {
  @apply rounded rounded-t-none border border-t-0 border-primary border-opacity-60;
}
.ac > .ac-option {
  @apply flex h-auto items-center border-b border-primary border-opacity-20 px-5 py-1 sm:py-2;
}
.ac-option-icon {
  @apply mx-3 fill-current text-black text-opacity-60;
}
.ac > .ac-option.selected,
.ac > .ac-option:hover:not(.group) {
  @apply bg-black bg-opacity-10;
}
.select {
  @apply w-full appearance-none rounded bg-primary pl-3 pr-10 text-lg text-white focus:outline-none;
  @apply h-10 sm:rounded-l sm:rounded-r-none;
}
.myinput {
  @apply relative h-10 w-full rounded border border-primary border-opacity-40 bg-opacity-5 px-3 text-xl font-light text-gray-700 placeholder-opacity-60 outline-none ring-0 md:text-lg;
}
.myinput {
  @apply sm:rounded-r sm:rounded-l-none;
}
.myinput:focus {
  @apply border border-primary bg-white outline-none ring-0;
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
