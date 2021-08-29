<template>
  <section class="relative">
    <m-loader-new v-if="isLoading" class="z-10 pt-40" />

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
                <div>{{ lib.alias }}</div>
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
                class="
                  text-white
                  border-r border-gray-300
                  bg-primary
                  first-header
                "
                :class="{ 'border-b': row.cat !== rows[rows.length - 1].cat }"
                scope="row"
              >
                <div
                  class="w-6"
                  :style="{ marginTop: CAT_CONFIG[row.cat].marginTop }"
                >
                  <div class="text-center transform -rotate-90">
                    {{ row.cat }}
                  </div>
                </div>
              </th>

              <!-- Metric header -->
              <th
                scope="row"
                class="
                  px-2
                  bg-gray-200
                  border-r border-separate border-gray-300
                  second-header
                "
                :class="{
                  'border-b':
                    index < rows.length - 1 && row.cat !== rows[index + 1].cat,
                  [CAT_CONFIG[row.cat].bgColor]: true,
                }"
              >
                <MetricHeader :type="row.metric" :row="row" />
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
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MetricHeader from './MetricHeader.vue';
import MetricValue from './MetricValue.vue';
import { libraries, isLoading, removeLibrary } from '@/store/libraries';
import { ROWS, NPM_METRICS, CAT_CONFIG, CategoryT } from './TableConfig';

const rows = computed(() => {
  const hasNpm = libraries.some((lib) => !!lib.npmPackage);
  const hasTags = libraries.some((lib) => !!lib.tags.length);
  let filteredRows = ROWS;
  filteredRows = hasTags
    ? filteredRows
    : filteredRows.filter((row) => row.metric !== 'tags');
  filteredRows = hasNpm
    ? filteredRows
    : filteredRows.filter((row) => !NPM_METRICS.includes(row.metric));

  return filteredRows;
});

const catsSpanMap = computed(() => {
  return rows.value.reduce((acc, row) => {
    if (!acc[row.cat]) {
      acc[row.cat] = 0;
    }
    acc[row.cat]++;
    return acc;
  }, {} as Record<CategoryT, number>);
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
