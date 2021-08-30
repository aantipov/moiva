<template>
  <div class="flex justify-between items-center">
    <div
      class="
        flex
        items-center
        justify-center
        sm:justify-start
        whitespace-nowrap
      "
    >
      <!--  Icon  -->
      <component
        :is="row.icon || `m-${type}-icon`"
        v-tooltip.html="row.tooltip || row.label"
        class="w-8 sm:hidden block"
        :class="{
          'h-3': type === 'tradar',
          'flex-shrink-0': type === 'commits' || type === 'contributors',
        }"
        :label="row.label"
      ></component>

      <!-- Label -->
      <div
        v-tooltip.html="row.tooltip || row.label"
        class="text-left hidden sm:block sm:ml-1"
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

    <!-- Chart Icon -->
    <MetricChart v-if="row.chart" :metric-data="row" />
  </div>
</template>

<script setup lang="ts">
import MetricChart from './MetricChart.vue';
import { MetricT, MetricDataT } from './TableConfig';

defineProps<{
  type: MetricT;
  row: MetricDataT;
}>();
</script>
