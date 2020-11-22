<template>
  <div>
    <div class="mx-auto mt-5 mb-5 text-center xl:w-2/3">
      <v-select
        v-model="selectedApps"
        multiple
        placeholder="Add libraries to comparison"
        :close-on-select="false"
        :clear-search-on-select="false"
        :options="appsWithCategories"
        label="name"
        :reduce="(app) => app.name"
        :selectable="(option) => !option.isCategory"
        :filter-by="filterOption"
      >
        <template #selected-option-container="{ option, deselect }">
          <Chip @close="deselect(option)">{{ option.name }}</Chip>
        </template>

        <template #option="option">
          <div
            class="option"
            :class="{ 'option--category': option.isCategory }"
          >
            {{ option.name }}
          </div>
        </template>
      </v-select>
    </div>

    <div v-if="selectedApps.length">
      <Github class="mt-0" :apps="selectedApps" />

      <div class="grid grid-cols-12 gap-4">
        <Npm :apps="selectedApps" class="col-span-12 xl:col-span-8" />
        <TechRadar :apps="selectedApps" class="col-span-12 xl:col-span-4" />
      </div>
    </div>

    <div v-else class="my-16 text-center p-lead">
      Select libraries you wish to compare
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Chart from 'chart.js';
import Npm from './Npm.vue';
import Github from './Github.vue';
import TechRadar from './TechRadar.vue';
import configApps, {
  AppConfigT,
  categoryMap,
  LibraryCategoryT,
} from '../../apps-config';
import VSelect from 'vue-select';
import 'vue-select/src/scss/vue-select.scss';
import Chip from './Chip.vue';

type OptionT =
  | AppConfigT
  | {
      name: string;
      isCategory: boolean;
    };

// @ts-ignore
Chart.defaults.global.title.fontSize = 14;
Chart.defaults.global.defaultFontSize = 14;
// @ts-ignore
Chart.defaults.global.title.fontFamily =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
Chart.defaults.global.defaultFontFamily =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

const appsWithCategories: OptionT[] = [...configApps];

// Add categories to appsWithCategories
let category = '';
let cats = 0;
configApps.forEach((app, i) => {
  if (app.category !== category) {
    category = app.category;

    appsWithCategories.splice(cats + i, 0, {
      name: categoryMap[category as LibraryCategoryT],
      isCategory: true,
    });
    cats++;
  }
});

export default Vue.extend({
  name: 'Main',
  components: {
    Github,
    Npm,
    TechRadar,
    VSelect,
    Chip,
  },
  data() {
    return {
      appsWithCategories,
      selectedApps: configApps
        .filter((app) => app.selected)
        .map((app) => app.name),
    };
  },
  methods: {
    filterOption(option: OptionT, label = '', search: string): boolean {
      if ('isCategory' in option) {
        return true;
      }
      return label.toLowerCase().indexOf(search.toLowerCase()) > -1;
    },
    isAppSelected(app: string): boolean {
      return this.selectedApps.indexOf(app) > -1;
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
  @apply h-full px-3 flex items-center;
}
.vs__dropdown-option .option--category {
  @apply uppercase;
}
.vs__dropdown-option--selected {
  @apply font-bold bg-gray-200;
}
.vs__dropdown-option--selected.vs__dropdown-option--highlight {
  @apply bg-red-400;
}
.vs__dropdown-option--highlight {
  @apply font-bold bg-green-400;
}
</style>
