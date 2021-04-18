<template>
  <div class="flex flex-col items-start sm:items-center">
    <h2 class="self-center mt-4 mb-2 sm:mt-8">Report</h2>

    <div class="wrapper-2021q1">
      <table>
        <thead class="text-white bg-primary">
          <tr>
            <th scope="col">
              <div class="w-52">Criteria</div>
            </th>
            <th v-for="item in frameworks" :key="item.repo" scope="col">
              <div>
                <a :href="getHref(item.repo)" class="primary-link">{{
                  getAlias(item.repo)
                }}</a>

                <a
                  :href="getGithubLink(item.repo)"
                  target="_blank"
                  class="ml-2 primary-link"
                  ><LinkIcon
                /></a>
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
              <MetricValue
                :type="metric"
                :lib="item"
                :npm="getNpm(item.repo)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Chart
      class="mt-10"
      :libs="frameworks"
      field="starsTotal"
      title="GitHub Stars"
      style="width: 700px"
    />

    <Chart
      class="mt-10"
      :libs="frameworks"
      field="starsPlus"
      title="New GitHub Stars in Q1 2021"
      style="width: 700px"
    />

    <Chart
      class="mt-10"
      :libs="frameworks"
      field="starsPlusPercentage"
      title="New GitHub Stars in Q1 2021, %"
      style="width: 700px"
    />

    <Chart
      class="mt-10"
      :libs="frameworks"
      field="dwnlMonthly"
      title="NPM Downloads monthly in Q1 2021"
      style="width: 700px"
    />

    <Chart
      class="mt-10"
      :libs="frameworks"
      field="dwnlMonthlyIncreasePercentage"
      title="NPM Downloads monthly increase in Q1 2021, %"
      style="width: 700px"
    />

    <Chart
      class="mt-10"
      :libs="frameworks"
      field="commits"
      title="Number of Commits in Q1 2021"
      style="width: 700px"
    />

    <Chart
      class="mt-10"
      :libs="frameworks"
      field="contributors"
      title="Number of Contributors in Q1 2021"
      style="width: 700px"
    />

    <Chart
      class="mt-10"
      :libs="frameworks"
      field="npmReleases"
      title="Number of NPM Releases in Q1 2021"
      style="width: 700px"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { constructHref } from '@/utils';
import libsData from './jam-2021-q1.json';
import { catalogRepoIdToLib } from '@/libraries-catalog';
import MetricHeader from './MetricHeader.vue';
import MetricValue from './MetricValue.vue';
import LinkIcon from '@/components/icons/Link.vue';
import Chart from './Chart.vue';

type TechRadarT = null | {
  url: string;
  level: string;
};

type BundleSizeT = null | {
  gzip: number;
  raw: number;
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
  security?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  bundleSize?: BundleSizeT;
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
  | 'security'
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
  'security',
  // 'bundlesize',
  'age',
  'license',
] as MetricT[];

export default defineComponent({
  name: 'Report',
  components: {
    MetricHeader,
    MetricValue,
    Chart,
    LinkIcon,
  },

  setup() {
    return {
      frameworks: libsData as LibT[],
      metrics,
      getAlias(repoId: string): string {
        return catalogRepoIdToLib[repoId.toLowerCase()].alias;
      },
      getGithubLink(repoId: string): string {
        return `https://github.com/${repoId}`;
      },
      getHref(repoId: string): string {
        const npm = catalogRepoIdToLib[repoId.toLowerCase()].npm as string;
        if (!npm) {
          throw new Error('no npm package');
        }
        return constructHref([npm], []);
      },
      getNpm(repoId: string): string {
        const npm = catalogRepoIdToLib[repoId.toLowerCase()].npm as string;
        if (!npm) {
          throw new Error('no npm package');
        }
        return npm;
      },
    };
  },
});
</script>

<style lang="postcss">
.wrapper-2021q1 {
  @apply border border-primary rounded;
  width: 100%;
  max-width: 1000px;
  overflow: scroll;
}
.row {
  @apply h-10;
}
table {
  @apply table-fixed;
}
table thead th div {
  @apply flex px-4;
}
table thead th:first-child {
  @apply h-10 bg-primary;
  position: sticky;
  left: 0;
  z-index: 2;
}

table td {
  @apply px-2;
}
table thead th {
  z-index: 1;
}
table tbody th {
  position: sticky;
  left: 0;
  z-index: 1;
  @apply bg-gray-200 px-2;
}
</style>
