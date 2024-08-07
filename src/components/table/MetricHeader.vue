<template>
  <div class="flex items-center justify-between">
    <div
      class="flex items-center justify-center whitespace-nowrap sm:justify-start"
    >
      <!--  Icon  -->
      <component
        :is="row.icon || `m-${type}-icon`"
        v-tooltip.html="row.tooltip || row.label"
        class="block w-8 sm:hidden"
        :class="{
          'h-3': type === 'tradar',
          'flex-shrink-0': type === 'commits' || type === 'contributors',
        }"
        :label="row.label"
      ></component>

      <!-- Label -->
      <div
        v-tooltip.html="row.tooltip || row.label"
        class="hidden text-left sm:ml-1 sm:block"
      >
        <div>
          {{ row.label }}

          <span v-if="row.labelSub" class="text-sm font-normal opacity-80">{{
            row.labelSub
          }}</span>
        </div>

        <div v-if="row.labelMore" class="text-sm font-normal opacity-80">
          {{ row.labelMore }}
        </div>
      </div>
    </div>

    <div class="ml-2 flex">
      <!-- Chart Icon -->
      <MetricChart
        v-if="row.chart && librariesIds.length > 1"
        :metric-data="rowWithChart"
      />

      <!-- Sorting button -->
      <MetricSort
        v-if="row.sortFn && librariesIds.length > 2"
        class="hidden sm:block"
        :sort-fn="row.sortFn"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import MetricChart from './MetricChart.vue';
import MetricSort from './MetricSort.vue';
import type { MetricT, MetricDataT, MetricDataWithChartT } from './TableConfig';
import { librariesIds } from '@/store/libraries';

const props = defineProps<{
  type: MetricT;
  row: MetricDataT;
}>();

const rowWithChart = props.row as MetricDataWithChartT;
</script>
