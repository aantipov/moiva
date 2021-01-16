<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-center mt-5">
      <h2 class="my-0">
        Google Trends - <span class="text-base">Interest Over Time</span>
      </h2>

      <m-chart-info class="ml-2">
        <p>
          Moiva uses data from
          <a :href="gTrendsLink" target="_blank">Google Trends</a>
          to build this chart.
        </p>
        <p>
          Google Trends doesn't provide sensible data for most of the libraries.
          So we exclude those libraries altogether.
        </p>
        <p>
          If you know a library for which it makes sense to include it in this
          chart - feel free to submit an
          <a
            href="https://github.com/aantipov/moiva-issues"
            target="_blank"
            rel="noopener"
            >issue</a
          >.
        </p>
      </m-chart-info>

      <m-chart-info v-if="isError" class="ml-2" type="WARNING">
        <div>
          <div>Sorry, we couldn't fetch data from Google Trends.</div>
          <div>Try reload the page or check later.</div>
        </div>
      </m-chart-info>
    </div>

    <!-- Chart -->
    <div class="relative" style="height: 350px">
      <m-loader v-if="isLoading || isLoadingLibsData" />

      <div v-else-if="isError" class="chart-error-new">
        <div>
          Sorry we couldn't load the data. <br />
          Try reload the page or check later
        </div>
      </div>

      <canvas
        v-show="!isError && filteredLibsNames.length"
        id="googleTrends"
      ></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, onMounted, watch, computed } from 'vue';
import Chart, { ChartDataSets } from 'chart.js';
import { format } from 'date-fns';
import { numbersFormatter } from '../utils';
import { GTrendPointT } from '../apis';
import { enUS } from 'date-fns/locale';

export default defineComponent({
  name: 'GTrendsChart',

  props: {
    isLoadingLibsData: { type: Boolean, required: true },
    isLoading: { type: Boolean, required: true },
    isError: { type: Boolean, required: true },
    libsNames: { type: Array as () => string[], required: true },
    libToColorMap: {
      type: Object as () => Record<string, string>,
      required: true,
    },
    libsTrends: { type: Array as () => GTrendPointT[], required: true },
    libsKeywords: { type: Array as () => string[], required: true },
  },

  setup(props) {
    const {
      libsNames,
      libToColorMap,
      libsTrends,
      libsKeywords,
      isLoading,
      isError,
    } = toRefs(props);

    const filteredLibsNames = computed<string[]>(() =>
      libsNames.value.filter(
        (libName, libIndex) => !!libsTrends.value[libIndex]
      )
    );

    const categories = computed(() =>
      libsTrends.value.map(({ time }) =>
        new Date(time * 1000).toISOString().slice(0, 10)
      )
    );

    const datasets = computed<ChartDataSets[]>(() =>
      filteredLibsNames.value.map((libName, libIndex) => ({
        label: libName,
        fill: false,
        data: libsTrends.value.map(({ value }) => value[libIndex]),
        backgroundColor: libToColorMap.value[libName],
        borderColor: libToColorMap.value[libName],
        borderWidth: 4,
        pointRadius: 0,
        pointHoverRadius: 6,
      }))
    );

    let mychart: Chart | undefined;

    function initChart(): void {
      const ctx = document.getElementById('googleTrends') as HTMLCanvasElement;

      mychart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: categories.value,
          datasets: datasets.value,
        },

        options: {
          tooltips: {
            callbacks: {
              title: (tooltipItems): string => {
                const month = tooltipItems[0].xLabel as string;

                return format(new Date(month), 'MMM, yyyy');
              },
            },
          },
          title: { display: false },
          scales: {
            adapters: { date: { locale: enUS } },
            xAxes: [{ type: 'time', time: { unit: 'year' } }],
            yAxes: [{ ticks: { callback: numbersFormatter.format } }],
          },
        },
      });
    }

    onMounted(initChart);

    watch([libsTrends, isLoading, isError], () => {
      if (!isLoading.value && !isError.value) {
        (mychart as Chart).data.labels = categories.value;
        (mychart as Chart).data.datasets = datasets.value;
        (mychart as Chart).update();
      }
    });

    return {
      filteredLibsNames,
      gTrendsLink: computed<string>(() => {
        const datesQueryParam = encodeURIComponent('2017-01-01 2021-01-11');
        const libsQueryParam = encodeURIComponent(libsKeywords.value.join(','));
        return `https://trends.google.com/trends/explore?cat=31&date=${datesQueryParam}&q=${libsQueryParam}`;
      }),
    };
  },
});
</script>
