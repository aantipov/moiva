<template>
  <div>
    <div class="flex items-center justify-center mt-5">
      <h2 class="my-0">
        Google Trends <span class="text-base">(max. 5 libs)</span>
      </h2>

      <m-chart-info class="ml-2">
        <p>
          <a
            href="https://trends.google.com/trends/explore?cat=31"
            target="_blank"
            >Google Trends</a
          >
          data is used to build the chart.
        </p>
      </m-chart-info>
    </div>

    <div v-if="isError" class="chart-error">
      Something went wrong while loading data. Try to reload the page or come
      later
    </div>

    <div v-if="isLoading" class="text-center p">Loading...</div>

    <div v-else-if="!filteredLibs.length" class="chart-error">
      No data for selected libraries
    </div>

    <div v-else class="chart">
      <GTrendsChart
        :libs="filteredLibs"
        :lib-to-color-map="libToColorMap"
        :data="data.timelineData"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GTrendsChart from './GTrendsChart.vue';
import { fetchGTrendsData, GTrendsT } from '../apis';

export default defineComponent({
  name: 'GoogleTrends',

  components: {
    GTrendsChart,
  },

  props: {
    libs: {
      type: Array as () => string[],
      required: true,
    },
    libToColorMap: {
      type: Object as () => Record<string, string>,
      required: true,
    },
  },

  data() {
    return {
      isLoading: true,
      isError: false,
      data: {} as GTrendsT,
      dataPromise: null as null | Promise<unknown>,
    };
  },

  computed: {
    filteredLibs(): string[] {
      // Google Trends allows to compare only 5 terms at max
      return this.libs.slice(0, 5);
    },
  },

  watch: {
    libs(): void {
      if (this.filteredLibs.length) {
        this.loadData();
      }
    },
  },

  mounted(): void {
    if (this.filteredLibs.length) {
      this.loadData();
    } else {
      this.isLoading = false;
    }
  },

  methods: {
    loadData(): void {
      this.isLoading = true;
      this.isError = false;

      const promise = (this.dataPromise = fetchGTrendsData(this.filteredLibs)
        .then((data) => {
          // Do nothing if there is a new request already in place
          if (this.dataPromise === promise) {
            this.data = data;
            this.isError = false;
            this.isLoading = false;
          }
        })
        .catch(() => {
          // Do nothing if there is a new request already in place
          if (this.dataPromise === promise) {
            this.isError = true;
            this.isLoading = false;
          }
        }));
    },
  },
});
</script>

<style scoped lang="scss">
.chart {
  height: 400px;
}
</style>
