<template>
  <div>
    <div>
      <div class="mb-1 text-xl text-center opacity-80">
        Add GitHub repository or Npm package
      </div>
      <!-- progressbar for non-mobile screens -->
      <div
        class="
          relative
          hidden
          w-full
          h-1
          overflow-hidden
          rounded-full
          sm:block
          indeterminate
        "
      >
        <div
          v-if="isLoading"
          class="absolute top-0 h-full rounded-full bg-primary progressbar"
          :style="{ width: `80%` }"
        >
          <span class="flex items-center h-full"><slot></slot></span>
        </div>
      </div>

      <div class="w-full sm:flex">
        <!--   GitHub/NPM switch       -->
        <div class="relative inline-flex w-full mb-2 sm:w-auto sm:mb-0">
          <ChevronDownIcon
            class="
              absolute
              top-0
              right-0
              w-6
              h-6
              mx-3
              my-4
              text-white
              pointer-events-none
            "
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
          class="
            relative
            w-full
            h-1
            overflow-hidden
            rounded-full
            sm:hidden
            indeterminate
          "
        >
          <div
            v-if="isLoading"
            class="absolute top-0 h-full rounded-full bg-primary progressbar"
            :style="{ width: `80%` }"
          >
            <span class="flex items-center h-full"><slot></slot></span>
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
            class="
              absolute
              top-0
              right-0
              z-10
              flex
              items-center
              justify-end
              h-full
              py-3
              pr-3
              w-14
              focus:outline-none
            "
            @click="searchValue = ''"
          >
            <m-close class="w-6 h-6 opacity-80" />
          </button>
        </div>
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
import ChevronDownIcon from '@/components/icons/ChevronDown.vue';

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
    ChevronDownIcon,
  },
  emits: ['select'],

  setup(_props, { emit }) {
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

        fetch: (text: string, update: (items: SearchItemT[]) => void) => {
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
              item.description ? item.description : ''
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

    return {
      inputRef: ref<HTMLInputElement>(null as unknown as HTMLInputElement),
      searchType,
      searchValue,
      isNpmSearch,
      isLoading,
      isError,
      isFocused,
    };
  },
});
</script>

<style lang="postcss">
.ac {
  @apply rounded rounded-t-none border border-t-0 border-primary border-opacity-60;
}
.ac > .ac-option {
  @apply flex items-center h-auto px-5 py-1 sm:py-2 border-b border-primary border-opacity-20;
}
.ac-option-icon {
  @apply mx-3 fill-current text-black text-opacity-60;
}
.ac > .ac-option.selected,
.ac > .ac-option:hover:not(.group) {
  @apply bg-black bg-opacity-10;
}
.select {
  @apply pl-3 pr-14 w-full text-lg rounded text-white focus:outline-none bg-primary appearance-none;
}
.select {
  @apply sm:rounded-l sm:rounded-r-none h-14 sm:pl-5;
}
.myinput {
  @apply bg-opacity-5 placeholder-opacity-60 ring-0 border border-primary border-opacity-40 relative w-full h-14 px-3 text-xl font-light text-gray-700 rounded outline-none md:text-2xl;
}
.myinput {
  @apply sm:rounded-r sm:rounded-l-none;
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
