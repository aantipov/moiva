<template>
  <div class="flex flex-col items-start sm:items-center">
    <h2 class="self-center mt-4 mb-2 sm:mt-8">Report</h2>

    <div style="max-width: 1000px; overflow: scroll">
      <table class="table-fixed">
        <thead class="text-white bg-primary">
          <tr>
            <th scope="col" class="bg-primary">
              <div class="w-52">Criteria</div>
            </th>
            <th
              v-for="item in frameworks"
              :key="item.repo"
              scope="col"
              class="align-bottom h-60"
            >
              <div class="w-20 pl-12 transform -rotate-90">
                {{ getAlias(item.repo) }}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Stars -->
          <tr v-for="(metric, index) in metrics" :key="metric" class="row">
            <th class="border-r border-gray-300">
              <MetricHeader :type="metric" class="border-r" />
            </th>
            <td
              v-for="item in frameworks"
              :key="item.repo"
              class="border-r border-gray-300"
              :class="{ 'bg-gray-200': index % 2 }"
            >
              <MetricValue :type="metric" :lib="item" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import { constructHref } from '@/utils';
import frameworks from './frameworks-2021-q1.json';
import { catalogRepoIdToLib } from '@/libraries-catalog';
import MetricHeader from './MetricHeader.vue';
import MetricValue from './MetricValue.vue';

type TechRadarT = null | {
  url: string;
  level: string;
};

type BundleSizeT = null | {
  gzip: string;
  raw: string;
};

export interface LibT {
  repo: string;
  starsPlus: number;
  starsPlusPercentage: number;
  starsTotal: number;
  descr: string;
  createdAt: string;
  commits: number;
  contributors: number;
  license: string;
  dependencies: number;
  tsSupport: string;
  npmReleases: number;
  dwnlMonthly: number;
  dwnlMonthlyIncreasePercentage: number;
  techRadar: TechRadarT;
  bundleSize: BundleSizeT;
  devUsage: null | number;
  googleTrends: null | number;
}

export type MetricT =
  | 'starsTotal'
  | 'starsPlus'
  | 'starsPlusPercentage'
  | 'downloads'
  | 'downloadsIncrease'
  | 'searchInterest'
  | 'devusage'
  | 'tradar'
  | 'releases'
  | 'commits'
  | 'contributors'
  | 'dependencies'
  | 'ts'
  | 'bundlesize'
  | 'age'
  | 'license';

const metrics = [
  'starsTotal',
  'starsPlus',
  'starsPlusPercentage',
  'downloads',
  'downloadsIncrease',
  'searchInterest',
  'devusage',
  'tradar',
  'releases',
  'commits',
  'contributors',
  'dependencies',
  'ts',
  'bundlesize',
  'age',
  'license',
] as MetricT[];

export default defineComponent({
  name: 'Report',
  components: {
    MetricHeader,
    MetricValue,
  },

  setup() {
    return {
      // makeHref(libs: string[]): string {
      //   return constructHref(libs, []);
      // },
      frameworks: frameworks as LibT[],
      metrics,
      getAlias(repoId: string): string {
        return catalogRepoIdToLib[repoId.toLowerCase()].alias;
      },
    };
  },
});
</script>

<style lang="postcss" scoped>
.row {
  @apply h-10;
}
table {
  @apply border;
}
td {
  @apply px-2;
}
table thead th {
  /* padding: 3px; */
  /* position: sticky; */
  /* top: 0; */
  z-index: 1;
  /* width: 25vw; */
  /* background: white; */
}
table thead th:first-child {
  position: sticky;
  left: 0;
  z-index: 2;
}
table tbody th {
  position: sticky;
  left: 0;
  z-index: 1;
  @apply bg-gray-200 px-2;
}
</style>
