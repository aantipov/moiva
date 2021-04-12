<template>
  <m-chart
    :title="title"
    :is-loading="false"
    :is-error="false"
    :libs-names="libsNames"
    :failed-libs-names="[]"
    :chart-config="chartConfig"
    :aria-label="''"
  >
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { ChartDataSets, ChartConfiguration } from 'chart.js';
import { numbersFormatter } from '@/utils';
import { catalogRepoIdToLib } from '@/libraries-catalog';
import { LibT } from './Report.vue';

export default defineComponent({
  name: 'Chart',

  props: {
    field: { type: String as () => 'starsTotal', required: true },
    libs: {
      type: Array as () => LibT[],
      required: true,
    },
    title: { type: String, required: true },
  },

  setup(props) {
    const { libs, field } = toRefs(props);
    const sortedLibs = computed(() =>
      [...libs.value].sort(
        (libA, libB) => libB[field.value] - libA[field.value]
      )
    );

    const libsNames = computed(() =>
      sortedLibs.value.map(
        (lib) => catalogRepoIdToLib[lib.repo.toLowerCase()].alias
      )
    );

    const datasets = computed<ChartDataSets[]>(() => [
      {
        data: sortedLibs.value.map((lib) => lib[field.value]),
        backgroundColor: '#CA8A04',
        borderWidth: 1,
      },
    ]);

    const chartConfig = computed<ChartConfiguration>(() => ({
      type: 'bar',
      data: {
        labels: libsNames.value,
        datasets: datasets.value,
      },
      options: {
        legend: {
          display: false,
        },
        scales: {
          yAxes: [
            { ticks: { beginAtZero: true, callback: numbersFormatter.format } },
          ],
          xAxes: [
            {
              gridLines: { display: false },
            },
          ],
        },
      },
    }));

    return { chartConfig, libsNames };
  },
});
</script>
