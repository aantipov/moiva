<template>
  <div class="flex flex-col items-start sm:items-center">
    <h2 class="self-center mt-4 mb-2 sm:mt-8">Report</h2>

    <div style="max-width: 1000px; overflow: scroll">
      <table class="table-fixed">
        <thead class="text-white bg-primary">
          <tr>
            <th scope="col" class="bg-primary">
              <div class="w-44">Criteria</div>
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
          <tr class="row">
            <th>
              <div class="flex items-center"><StarIcon /> Stars</div>
            </th>
            <td v-for="item in frameworks" :key="item.repo">
              {{ item.starsTotal }}
            </td>
          </tr>

          <tr class="row">
            <th>
              <div class="flex items-center"><StarIcon /> New Stars</div>
            </th>
            <td v-for="item in frameworks" :key="item.repo">
              {{ item.starsPlus }}
            </td>
          </tr>

          <tr class="row">
            <th>
              <div class="flex items-center"><StarIcon /> New Stars, %</div>
            </th>
            <td v-for="item in frameworks" :key="item.repo">
              {{ item.starsPlusPercentage }}
            </td>
          </tr>

          <tr class="row">
            <th>
              <div class="flex items-center">
                <DownloadIcon />
                <div>monthly</div>
              </div>
            </th>
            <td v-for="item in frameworks" :key="item.repo">
              {{ item.dwnlMonthly }}
            </td>
          </tr>

          <tr class="row">
            <th>
              <div class="flex items-center">
                <DownloadIcon />
                <div>monthly % (incr.)</div>
              </div>
            </th>
            <td v-for="item in frameworks" :key="item.repo">
              {{ item.dwnlMonthlyIncreasePercentage }}
            </td>
          </tr>

          <tr class="row">
            <th>
              <div class="flex items-center">
                <TagIcon />
                <div>Releases</div>
              </div>
            </th>
            <td v-for="item in frameworks" :key="item.repo">
              {{ item.npmReleases }}
            </td>
          </tr>

          <tr class="row">
            <th>
              <div class="flex items-center">
                <div>Age</div>
              </div>
            </th>
            <td v-for="item in frameworks" :key="item.repo">
              {{ getAge(item.createdAt) }}
            </td>
          </tr>

          <tr class="row">
            <th>
              <div class="flex items-center">
                <div>Commits</div>
              </div>
            </th>
            <td v-for="item in frameworks" :key="item.repo">
              {{ item.commits }}
            </td>
          </tr>

          <tr class="row">
            <th>
              <div class="flex items-center">
                <div>Contributors</div>
              </div>
            </th>
            <td v-for="item in frameworks" :key="item.repo">
              {{ item.contributors }}
            </td>
          </tr>

          <tr class="row">
            <th>
              <div class="flex items-center">
                <div>License</div>
              </div>
            </th>
            <td v-for="item in frameworks" :key="item.repo">
              {{ item.license }}
            </td>
          </tr>

          <tr class="row">
            <th>
              <div class="flex items-center">
                <div>Dependencies</div>
              </div>
            </th>
            <td v-for="item in frameworks" :key="item.repo">
              {{ item.dependencies }}
            </td>
          </tr>

          <tr class="row">
            <th>
              <div class="flex items-center">
                <div>TypeScript</div>
              </div>
            </th>
            <td v-for="item in frameworks" :key="item.repo">
              {{ item.tsSupport }}
            </td>
          </tr>

          <tr class="row">
            <th>
              <div class="flex items-center">
                <div>Tech Radar</div>
              </div>
            </th>
            <td v-for="item in frameworks" :key="item.repo">
              {{ (item.techRadar && item.techRadar.level) || '-' }}
            </td>
          </tr>

          <tr class="row">
            <th>
              <div class="flex items-center">
                <div>Bundle Size</div>
              </div>
            </th>
            <td v-for="item in frameworks" :key="item.repo">
              {{ item.bundleSize && item.bundleSize.gzip }}
            </td>
          </tr>

          <tr class="row">
            <th>
              <div class="flex items-center">
                <div>Developer Usage</div>
              </div>
            </th>
            <td v-for="item in frameworks" :key="item.repo">
              {{ item.devUsage }}
            </td>
          </tr>

          <tr class="row">
            <th>
              <div class="flex items-center">
                <div>Google Trends</div>
              </div>
            </th>
            <td v-for="item in frameworks" :key="item.repo">
              {{ item.googleTrends || '-' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, h } from 'vue';
// import { constructHref } from '@/utils';
import frameworks from './frameworks-2021-q1.json';
import { catalogRepoIdToLib } from '@/libraries-catalog';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
// import GithubIcon from './icons/Github.vue';
import StarIcon from '@/components/icons/Star.vue';
import DownloadIcon from '@/components/icons/Download.vue';
import TagIcon from '@/components/icons/Tag.vue';

interface LibT {
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
  techRadar: null | {
    url: string;
    level: string;
  };
  bundleSize: null | {
    gzip: number;
    raw: number;
    devUsage: number;
    googleTrends: number;
  };
}

export default defineComponent({
  name: 'Report',
  components: {
    // GithubIcon,
    StarIcon,
    DownloadIcon,
    TagIcon,
  },

  setup() {
    return {
      // makeHref(libs: string[]): string {
      //   return constructHref(libs, []);
      // },
      frameworks: frameworks as LibT[],
      getAlias(repoId: string): string {
        return catalogRepoIdToLib[repoId.toLowerCase()].alias;
      },
      getAge(createdAt: string): string {
        return formatDistanceToNowStrict(new Date(createdAt));
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
