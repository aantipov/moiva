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
            <tr v-for="(row, index) in rows" :key="row.metric">
              <!--  Category header (e.g. Popularity, Maintenance, Misc.)  -->
              <th
                v-if="index === 0 || row.cat !== rows[index - 1].cat"
                :rowspan="catsSpanMap[row.cat]"
                class="text-white border-r border-gray-300 bg-primary first-header"
                :class="{ 'border-b': row.cat !== rows[rows.length - 1].cat }"
                scope="row"
              >
                <div class="w-6 mt-20">
                  <div class="text-center transform -rotate-90">
                    {{ row.cat }}
                  </div>
                </div>
              </th>

              <!-- Metric header -->
              <th
                scope="row"
                class="px-2 bg-gray-200 border-r border-separate border-gray-300 second-header"
                :class="{
                  'border-b':
                    index < rows.length - 1 && row.cat !== rows[index + 1].cat,
                  [row.classVal]: true,
                }"
              >
                <MetricHeader :type="row.metric" />
              </th>

              <!-- Libs values -->
              <td
                v-for="lib in libraries"
                :key="lib.id"
                class="p-2 bg-white border-r border-gray-300"
                :class="{ 'bg-gray-200': index % 2 }"
              >
                <MetricValue :type="row.metric" :lib="lib" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import Loader from '../Loader.vue';
import MetricHeader from './MetricHeader.vue';
import MetricValue from './MetricValue.vue';
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

export type MetricT = typeof METRICS[number];
type CategoryT = '' | 'Popularity' | 'Maintenance' | 'Miscellaneous';

const ROWS: { metric: MetricT; cat: CategoryT; classVal: string }[] = [
  { metric: 'npm', cat: '', classVal: '' },
  { metric: 'repo', cat: '', classVal: '' },
  { metric: 'stars', cat: 'Popularity', classVal: 'bg-green-100' },
  { metric: 'downloads', cat: 'Popularity', classVal: 'bg-green-100' },
  { metric: 'searchInterest', cat: 'Popularity', classVal: 'bg-green-100' },
  { metric: 'devusage', cat: 'Popularity', classVal: 'bg-green-100' },
  { metric: 'releases', cat: 'Maintenance', classVal: 'bg-yellow-100' },
  { metric: 'commits', cat: 'Maintenance', classVal: 'bg-yellow-100' },
  { metric: 'contributors', cat: 'Maintenance', classVal: 'bg-yellow-100' },
  { metric: 'dependencies', cat: 'Miscellaneous', classVal: 'bg-purple-100' },
  { metric: 'bundlesize', cat: 'Miscellaneous', classVal: 'bg-purple-100' },
  { metric: 'ts', cat: 'Miscellaneous', classVal: 'bg-purple-100' },
  { metric: 'tradar', cat: 'Miscellaneous', classVal: 'bg-purple-100' },
  { metric: 'security', cat: 'Miscellaneous', classVal: 'bg-purple-100' },
  { metric: 'vulnerability', cat: 'Miscellaneous', classVal: 'bg-purple-100' },
  { metric: 'age', cat: 'Miscellaneous', classVal: 'bg-purple-100' },
  { metric: 'license', cat: 'Miscellaneous', classVal: 'bg-purple-100' },
];

export default defineComponent({
  name: 'Table',

  components: {
    Loader,
    MetricHeader,
    MetricValue,
  },

  setup() {
    const rowsRef = computed(() => {
      return ROWS;
    });

    const catsSpanMapRef = computed(() => {
      return rowsRef.value.reduce((acc, row) => {
        if (!acc[row.cat]) {
          acc[row.cat] = 0;
        }
        acc[row.cat]++;
        return acc;
      }, {} as Record<CategoryT, number>);
    });

    return {
      libraries,
      isLoading,
      removeLibrary,
      rows: rowsRef,
      metrics: METRICS,
      catsSpanMap: catsSpanMapRef,
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
