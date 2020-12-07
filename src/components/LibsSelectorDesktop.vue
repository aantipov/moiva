<template>
  <v-select
    :value="value"
    multiple
    placeholder="Add libraries to comparison..."
    :close-on-select="false"
    :clear-search-on-select="false"
    :clear-search-on-blur="() => true"
    :options="libsWithCats"
    label="name"
    :reduce="(lib) => lib.name"
    :selectable="(option) => !option.isCategory"
    :filter-by="filterOption"
    @input="$emit('input', $event)"
  >
    <template #selected-option-container="{ option, deselect }">
      <jd-chip selected @close="deselect(option)">{{ option.name }}</jd-chip>
    </template>

    <template #option="option">
      <div class="option" :class="{ 'option--category': option.isCategory }">
        <div v-if="!option.isCategory" class="w-8">
          <Checkmark v-if="isLibSelected(option.name)" />
        </div>
        {{ option.name }}
      </div>
    </template>
  </v-select>
</template>

<script lang="ts">
import Vue from 'vue';
import VSelect from 'vue-select';
import Checkmark from './Checkmark.vue';
import '../vue-select-override.scss';
import libsConfigs, {
  AppConfigT,
  categoryMap,
  LibraryCategoryT,
} from '../../apps-config';

type OptionT =
  | AppConfigT
  | {
      name: string;
      isCategory: boolean;
    };

// Define options list: libs + categories
const libsWithCats: OptionT[] = [...libsConfigs];
let category = '';
let cats = 0;
libsConfigs.forEach((libConfig, i) => {
  if (libConfig.category !== category) {
    category = libConfig.category;

    libsWithCats.splice(cats + i, 0, {
      name: categoryMap[category as LibraryCategoryT],
      isCategory: true,
    });
    cats++;
  }
});

export default Vue.extend({
  name: 'LibsSelectorDesktop',

  components: {
    VSelect,
    Checkmark,
  },

  props: {
    value: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      libsWithCats,
    };
  },

  methods: {
    filterOption(option: OptionT, label = '', search: string): boolean {
      if ('isCategory' in option) {
        return true;
      }
      return label.toLowerCase().indexOf(search.toLowerCase()) > -1;
    },
    isLibSelected(lib: string): boolean {
      return this.value.indexOf(lib) > -1;
    },
  },
});
</script>

<style lang="postcss">
.vs__dropdown-toggle {
  height: auto;
  @apply py-1;
}
.vs__open-indicator {
  @apply mr-1;
}
.vs__dropdown-option {
  @apply h-12 p-0;
}
.vs__dropdown-option .option {
  @apply h-full px-3 flex items-center text-gray-800;
}
.vs__dropdown-option .option--category {
  @apply uppercase text-gray-800;
}
.vs__dropdown-option--selected {
  @apply font-bold text-gray-800;
}
.vs__dropdown-option--selected.vs__dropdown-option--highlight {
  @apply cursor-default;
}
.vs__dropdown-option--highlight {
  @apply text-black bg-gray-200 text-black;
}
.vs__search {
  @apply h-8;
}
.vs__search::placeholder {
  @apply text-gray-600;
}
</style>

<style lang="scss">
$vs-dropdown-max-height: 30px;
</style>
