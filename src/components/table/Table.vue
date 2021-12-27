<template>
  <section class="relative">
    <m-loader-new v-if="isLoading" class="z-10 pt-40" />

    <div class="flex justify-center">
      <div
        class="overflow-scroll border rounded border-primary bg-primary shadow-xl"
      >
        <table>
          <thead class="text-white bg-primary">
            <tr>
              <td class="text-center px-1 py-2 font-bold"></td>

              <th
                v-for="lib in libraries"
                :key="lib.id"
                scope="col"
                class="relative px-8 py-2 col"
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
              <!-- Metric header -->
              <th
                scope="row"
                class="px-2 bg-gray-200 border-r border-separate border-gray-300 second-header"
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
                class="p-2 bg-white border-r border-gray-300 col"
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

const props = defineProps({
  category: {
    type: String as () => CategoryT,
    required: false,
    default: null,
  },
});

const rows = computed(() => {
  const hasNpm = libraries.some((lib) => !!lib.npmPackage);
  const hasTags = libraries.some((lib) => !!lib.tags.length);
  const hasPlayground = libraries.some((lib) => !!lib.playground);
  let filteredRows = ROWS;
  filteredRows = hasTags
    ? filteredRows
    : filteredRows.filter((row) => row.metric !== 'tags');
  filteredRows = hasNpm
    ? filteredRows
    : filteredRows.filter((row) => !NPM_METRICS.includes(row.metric));
  filteredRows = hasPlayground
    ? filteredRows
    : filteredRows.filter((row) => row.metric !== 'playground');
  filteredRows =
    props.category !== null
      ? filteredRows.filter((row) => row.cat === props.category)
      : filteredRows;

  return filteredRows;
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
  left: 0px;
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
  left: 0px;
  z-index: 2;
}
.col {
  min-width: 170px;
  max-width: 220px;
  overflow: hidden;
}
</style>
