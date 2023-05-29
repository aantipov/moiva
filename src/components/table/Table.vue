<template>
  <section class="relative">
    <LoaderNew v-if="isLoading" class="z-10 pt-40" />

    <div class="flex justify-center">
      <div
        class="overflow-scroll rounded-md border shadow-xl"
        :class="{
          [CAT_CONFIG[category].borderColor]: true,
        }"
      >
        <table>
          <thead
            :class="{
              [CAT_CONFIG[category].bgHeaderColor]: true,
              [CAT_CONFIG[category].textColor]: true,
            }"
          >
            <tr>
              <td
                class="px-1 py-2 text-center font-bold"
                :class="{
                  [CAT_CONFIG[category].bgHeaderColor]: true,
                }"
              ></td>

              <th
                v-for="lib in libraries"
                :key="lib.id"
                scope="col"
                class="col relative px-8 py-2"
              >
                <div>{{ lib.alias }}</div>
                <div
                  class="absolute top-0 right-0 flex h-full w-10 cursor-pointer items-center pl-2"
                >
                  <m-close
                    class="rounded-md p-1 hover:bg-black/20 hover:shadow-md active:bg-black/40 active:shadow-none"
                    @click="() => removeLibrary(lib.id)"
                  />
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(row, index) in rows" :key="row.metric">
              <!-- Metric header -->
              <th
                scope="row"
                class="border-separate border-r px-2"
                :class="{
                  'border-b':
                    index < rows.length - 1 && row.cat !== rows[index + 1].cat,
                  [CAT_CONFIG[row.cat].bgMetricColor]: true,
                }"
              >
                <MetricHeader :type="row.metric" :row="row" />
              </th>

              <!-- Libs values -->
              <td
                v-for="(lib, i) in libraries"
                :key="lib.id"
                class="col bg-white p-2"
                :class="{
                  'bg-opacity-80': index % 2,
                  'bg-opacity-70': !(index % 2),
                  ['border-r ' + CAT_CONFIG[category].separatorColor]:
                    libraries.length > i + 1,
                }"
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
import LoaderNew from '@/components/LoaderNew.vue';
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
  @apply font-mono text-sm font-medium sm:text-base;
}
table {
  border-spacing: 0;
  @apply table-fixed border-separate;
}
table thead td:first-child {
  position: sticky;
  left: 0;
  z-index: 2;
}
table thead th {
  z-index: 1;
}
table tbody tr th {
  position: sticky;
  left: 0;
  z-index: 2;
}
.col {
  min-width: 170px;
  max-width: 220px;
  overflow: hidden;
}
</style>
