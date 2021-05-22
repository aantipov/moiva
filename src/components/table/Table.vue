<template>
  <div>
    <Loader v-if="isLoading" class="z-10" />

    <div class="flex justify-center">
      <div class="overflow-scroll border rounded border-primary bg-primary">
        <table>
          <thead class="text-white bg-primary">
            <tr>
              <td></td>
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
                v-if="isMetricStartsNewCategory(index)"
                :rowspan="getMetricSpan(index)"
                class="text-white border-r border-gray-300 bg-primary first-header"
                :class="{
                  'border-b': [0, 2, 6].includes(index),
                }"
                scope="row"
              >
                <div class="w-6 mt-20">
                  <div class="text-center transform -rotate-90">
                    {{ getMetricCategory(index) }}
                  </div>
                </div>
              </th>
              <th
                scope="row"
                class="px-2 bg-gray-200 border-r border-separate border-gray-300 second-header"
                :class="{
                  'border-b': shouldShowBottomBorder(index),
                  'bg-green-100': [2, 3, 4, 5].includes(index),
                  'bg-yellow-100': [6, 7, 8].includes(index),
                  'bg-purple-100': index > 8,
                }"
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
  'downloads',
  'searchInterest',
  'devusage',
  'releases',
  'commits',
  'contributors',
  'dependencies',
  'bundlesize',
  'ts',
  'tradar',
  'security',
  'vulnerability',
  'age',
  'license',
] as const;

const METRICS_CATS = METRICS.map((metric) => {
  let cat;
  if (['npm', 'repo'].includes(metric)) {
    cat = '';
  } else if (
    ['stars', 'downloads', 'searchInterest', 'devusage'].includes(metric)
  ) {
    cat = 'Popularity';
  } else if (['releases', 'commits', 'contributors'].includes(metric)) {
    cat = 'Maintenance';
  } else {
    cat = 'Miscellaneous';
  }
  return { metric, cat };
});

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
      isMetricStartsNewCategory(i: number): boolean {
        if (i === 0) {
          return true;
        }
        return METRICS_CATS[i].cat !== METRICS_CATS[i - 1].cat;
      },
      getMetricCategory(i: number): string {
        return METRICS_CATS[i].cat;
      },
      getMetricSpan(i: number): number {
        return [2, 2, 4, 4, 4, 4, 3, 3, 3, 8, 8, 8, 8, 8, 8, 8, 8][i];
      },
      shouldShowBottomBorder(i: number): boolean {
        return [1, 5, 8].includes(i);
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
  border-spacing: 0;
  @apply table-fixed border-separate;
}
table thead td:first-child {
  @apply bg-primary;
  position: sticky;
  left: 0;
  z-index: 2;
}
table thead td:nth-child(2) {
  @apply bg-primary;
  position: sticky;
  left: 27px;
  z-index: 2;
}
table thead th {
  z-index: 1;
}
table tbody tr th.first-header {
  position: sticky;
  left: 0;
  z-index: 2;
}
table tbody tr th.second-header {
  position: sticky;
  left: 27px;
  z-index: 2;
}
</style>
