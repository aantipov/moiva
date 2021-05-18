<template>
  <div>
    <Loader v-if="isLoading" class="z-10" />

    <div class="flex justify-center">
      <div class="overflow-scroll border rounded border-primary bg-primary">
        <table>
          <thead class="text-white bg-primary">
            <tr>
              <td class="flex justify-center px-1 py-2 font-bold">Metric</td>

              <th
                v-for="lib in libraries"
                :key="lib.id"
                scope="col"
                class="relative px-8"
              >
                <div v-tooltip="lib.repo.description">
                  {{ lib.alias }}
                </div>
                <m-close
                  class="absolute top-0 right-0 w-8 h-full px-2 cursor-pointer"
                  @click="() => removeLibrary(lib.id)"
                />
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(metric, index) in metrics" :key="metric">
              <th
                scope="row"
                class="px-2 bg-gray-200 border-r border-separate border-gray-300"
              >
                <MetricHeader :type="metric" />
              </th>

              <td
                v-for="lib in libraries"
                :key="lib.id"
                class="p-2 bg-white border-r border-gray-300"
                :class="{ 'bg-gray-200': index % 2 }"
              >
                <MetricValue :type="metric" :lib="lib" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Loader from '../Loader.vue';
import MetricHeader from './MetricHeader.vue';
import MetricValue from './MetricValue.vue';
// import { ReadonlyLibraryT } from '@/libraryApis';
import { libraryToColorMap } from '@/store/librariesColors';
import {
  libraries,
  isLoading,
  removeLibrary,
  removeAllLibraries,
} from '@/store/libraries';

const METRICS = [
  'npm',
  'repo',
  'stars',
  'starsPlus',
  'downloads',
  'downloadsIncrease',
  'searchInterest',
  'devusage',
  'tradar',
  'releases',
  'commits',
  'contributors',
  'dependencies',
  'ts',
  'security',
  'vulnerability',
  'bundlesize',
  'age',
  'license',
] as const;

export type MetricT = typeof METRICS[number];

export default defineComponent({
  name: 'Table',

  components: {
    Loader,
    MetricHeader,
    MetricValue,
  },

  setup() {
    return {
      libraries,
      isLoading,
      removeLibrary,
      metrics: METRICS,
      getLibColor(libraryId: string): string {
        return libraryToColorMap.value[libraryId];
      },
      clearSelection() {
        removeAllLibraries();
      },
    };
  },
});
</script>

<style lang="postcss" scoped>
.link {
  @apply font-mono text-sm sm:text-base font-medium;
}
table {
  @apply table-fixed;
}
table thead td:first-child {
  @apply bg-primary;
  position: sticky;
  left: 0;
  z-index: 2;
}
table thead th {
  z-index: 1;
}
table tbody th {
  position: sticky;
  left: 0;
  z-index: 1;
}
</style>
