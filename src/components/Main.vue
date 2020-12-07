<template>
  <div>
    <LibsSelectorMobile
      v-model="selectedApps"
      class="block sm:hidden"
      :libs="appsWithCategories"
    />

    <div class="hidden mx-auto mt-5 text-center sm:block xl:w-2/3">
      <v-select
        v-model="selectedApps"
        multiple
        placeholder="Add libraries to comparison..."
        :close-on-select="false"
        :clear-search-on-select="false"
        :clear-search-on-blur="() => true"
        :options="appsWithCategories"
        label="name"
        :reduce="(app) => app.name"
        :selectable="(option) => !option.isCategory"
        :filter-by="filterOption"
      >
        <template #selected-option-container="{ option, deselect }">
          <Chip selected @close="deselect(option)">{{ option.name }}</Chip>
        </template>

        <template #option="option">
          <div
            class="option"
            :class="{ 'option--category': option.isCategory }"
          >
            <div v-if="!option.isCategory" class="w-8">
              <Checkmark v-if="isAppSelected(option.name)" />
            </div>
            {{ option.name }}
          </div>
        </template>
      </v-select>
    </div>

    <div v-if="selectedApps.length">
      <div class="grid grid-cols-12 gap-4">
        <Npm :apps="selectedApps" class="col-span-12 xl:col-span-8" />
        <TechRadar :apps="selectedApps" class="col-span-12 xl:col-span-4" />
      </div>

      <GoogleTrends :apps="selectedApps" />

      <Github :apps="selectedApps" />
    </div>

    <div v-else class="my-16 text-center p-lead">
      Add libraries to comparison
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Npm from './Npm.vue';
import Github from './Github.vue';
import LibsSelectorMobile from './LibsSelectorMobile.vue';
import TechRadar from './TechRadar.vue';
import GoogleTrends from './GTrends.vue';
import Checkmark from './Checkmark.vue';
import configApps, {
  AppConfigT,
  categoryMap,
  LibraryCategoryT,
  appsConfigsMap,
} from '../../apps-config';
import VSelect from 'vue-select';
import '../vue-select-override.scss';
import Chip from './Chip.vue';

type OptionT =
  | AppConfigT
  | {
      name: string;
      isCategory: boolean;
    };

// Define options list - apps + categories
const appsWithCategories: OptionT[] = [...configApps];
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

// Define a default list of apps and fix the url if wrong apps are passed
const Url = new URL(window.location.href);
const appsUrlParam = Url.searchParams.get('apps');
const appsFromUrl = appsUrlParam?.split('--') || [];
const appsFromUrlValidated = appsFromUrl.filter(
  (urlApp) => !!configApps.find((app) => app.urlname === urlApp)
);
let defaultSelectedUrlApps = configApps
  .filter((app) => app.selected)
  .map((app) => app.urlname);

// Make sure the url is valid - update it if not empty
if (!appsFromUrlValidated.length) {
  Url.searchParams.delete('apps');
  window.history.replaceState(null, '', Url.href);
} else {
  Url.searchParams.set('apps', appsFromUrlValidated.join('--'));
  window.history.replaceState(null, '', Url.href);
  defaultSelectedUrlApps = appsFromUrlValidated;
}

// @ts-ignore
const selectedApps = defaultSelectedUrlApps.map(
  (urlApp) =>
    (configApps.find((app) => app.urlname === urlApp) as AppConfigT).name
);

function updateUrl(selectedApps: string[]): void {
  if (!selectedApps.length) {
    Url.searchParams.delete('apps');
    window.history.replaceState(null, '', Url.href);
    return;
  }

  const selectedAppsUrlnames = selectedApps.map(
    (app) => appsConfigsMap[app].urlname
  );
  Url.searchParams.set('apps', selectedAppsUrlnames.join('--'));
  window.history.replaceState(null, '', Url.href);
}

export default Vue.extend({
  name: 'Main',
  components: {
    Github,
    Npm,
    TechRadar,
    GoogleTrends,
    VSelect,
    Chip,
    Checkmark,
    LibsSelectorMobile,
  },
  data() {
    return {
      appsWithCategories,
      selectedApps,
    };
  },
  watch: {
    selectedApps(): void {
      // This is a workaround for a problem of being able to select a category
      // TODO: fix the problem
      const stateManIndex = this.selectedApps.indexOf('# State Management');
      const testingIndex = this.selectedApps.indexOf('# Testing');
      const frameworksIndex = this.selectedApps.indexOf('# Frameworks');
      const foundElementIndex = [
        stateManIndex,
        testingIndex,
        frameworksIndex,
      ].find((i) => i > -1);

      if (foundElementIndex !== undefined) {
        this.selectedApps.splice(foundElementIndex, 1);
        return;
      }

      updateUrl(this.selectedApps);
    },
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
