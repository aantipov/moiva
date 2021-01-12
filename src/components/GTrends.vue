<template>
  <div>
    <div class="flex items-center justify-center mt-5">
      <h2 class="my-0">
        Google Trends <span class="text-base">(max. 5 libs)</span>
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
    </div>

    <div v-if="isError" class="chart-error">
      Something went wrong while loading data. Try to reload the page or come
      later
    </div>

    <div v-if="isLoading" class="text-center p">Loading...</div>

    <div v-else-if="!filteredLibs.length" class="chart-error">
      No data for selected libraries
    </div>

    <div v-else style="height: 350px">
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
import { libsToKeywordMap } from '../../google-trends.config';
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
      // We need to compare only those libs for which Google trends
      // has sensible data
      // Google Trends allows to compare only 5 terms at max
      return this.libs
        .filter((libName) => !!libsToKeywordMap[libName])
        .slice(0, 5);
    },
    filteredLibsKeywords(): string[] {
      // We need to compare only those libs for which Google trends
      // has sensible data
      // Google Trends allows to compare only 5 terms at max
      return this.filteredLibs.map((libName) => libsToKeywordMap[libName]);
    },
    gTrendsLink(): string {
      const datesQueryParam = encodeURIComponent('2017-01-01 2021-01-11');
      const libsQueryParam = encodeURIComponent(
        this.filteredLibsKeywords.join(',')
      );
      return `https://trends.google.com/trends/explore?cat=31&date=${datesQueryParam}&q=${libsQueryParam}`;
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
