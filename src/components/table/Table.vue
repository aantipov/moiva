<template>
  <div>
    <Loader v-if="isLoading" />

    <div class="flex justify-end pr-4">
      <a v-tooltip="`Clear selection`" href="/" @click.prevent="clearSelection"
        >Clear</a
      >
    </div>

    <div class="flex justify-center mb-24">
      <div class="overflow-scroll border rounded border-primary">
        <table class="">
          <thead class="text-white bg-primary">
            <tr>
              <th scope="col">
                <div class="py-2 w-52">Criteria</div>
              </th>
              <th v-for="lib in libraries" :key="lib.repo" scope="col">
                <div class="px-4">{{ lib.alias }}</div>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(metric, index) in metrics" :key="metric" class="row">
              <th class="px-2 bg-gray-200 border-r border-gray-300">
                <MetricHeader :type="metric" class="border-r" />
              </th>

              <td
                v-for="lib in libraries"
                :key="lib.id"
                class="p-2 border-r border-gray-300"
                :class="{ 'bg-gray-200': index % 2 }"
              >
                <MetricValue :type="metric" :lib="lib" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Loader from '../Loader.vue';
import MetricHeader from './MetricHeader.vue';
import MetricValue from './MetricValue.vue';
import { ReadonlyLibraryT } from '@/libraryApis';
import { constructHref } from '@/utils';
import { libraryToColorMap } from '@/store/librariesColors';
import {
  libraries,
  isLoading,
  removeLibrary,
  removeAllLibraries,
} from '@/store/libraries';

const METRICS = [
  'npm',
  'repo',
  'stars',
  // 'starsPlus',
  // 'starsPlusPercentage',
  // 'downloads',
  // 'downloadsIncrease',
  // 'searchInterest',
  // 'devusage',
  // 'tradar',
  // 'releases',
  // 'commits',
  // 'contributors',
  'dependencies',
  'ts',
  'security',
  // 'bundlesize',
  'age',
  'license',
] as const;

export type MetricT = typeof METRICS[number];

export default defineComponent({
  name: 'Table',

  components: {
    Loader,
    MetricHeader,
    MetricValue,
  },

  setup() {
    return {
      libraries,
      isLoading,
      removeLibrary,
      metrics: METRICS,
      getRemainedLibsLink(deletedLib: ReadonlyLibraryT): string {
        const npmPackagesNames = [] as string[];
        const reposIds = [] as string[];

        libraries.forEach((library) => {
          if (library.npmPackage) {
            npmPackagesNames.push(library.npmPackage.name);
          } else {
            reposIds.push(library.repo.repoId);
          }
        });

        if (deletedLib.npmPackage) {
          const index = npmPackagesNames.indexOf(deletedLib.npmPackage.name);
          npmPackagesNames.splice(index, 1);
        } else {
          const index = reposIds.indexOf(deletedLib.repo.repoId);
          reposIds.splice(index, 1);
        }

        return constructHref(npmPackagesNames, reposIds);
      },
      getLibColor(libraryId: string): string {
        return libraryToColorMap.value[libraryId];
      },
      clearSelection() {
        removeAllLibraries();
      },
    };
  },
});
</script>

<style lang="postcss" scoped>
.link {
  @apply font-mono text-sm sm:text-base font-medium;
}
</style>
