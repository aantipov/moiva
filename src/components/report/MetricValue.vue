<template>
  <div v-if="type === 'starsTotal'" class="flex justify-end">
    {{ formatNumber(lib.starsTotal) }}
  </div>

  <div v-else-if="type === 'starsPlus'" class="flex items-center justify-end">
    {{ formatNumber(lib.starsPlus) }}
  </div>

  <div
    v-else-if="type === 'starsPlusPercentage'"
    class="flex items-center justify-end"
  >
    {{ lib.starsPlusPercentage }}%
  </div>

  <div v-else-if="type === 'downloads'" class="flex items-center justify-end">
    {{ formatNumber(lib.dwnlMonthly) }}
  </div>

  <div
    v-else-if="type === 'downloadsIncrease'"
    class="flex items-center justify-end"
  >
    {{ lib.dwnlMonthlyIncreasePercentage }}%
  </div>

  <div
    v-else-if="type === 'searchInterest'"
    class="flex items-center justify-end"
  >
    {{ (lib.googleTrends && lib.googleTrends + '%') || '-' }}
  </div>

  <div v-else-if="type === 'devusage'" class="flex items-center justify-end">
    {{ (lib.devUsage && lib.devUsage + '%') || '-' }}
  </div>

  <div v-else-if="type === 'tradar'" class="flex items-center justify-center">
    {{ (lib.techRadar && lib.techRadar.level) || '-' }}
  </div>

  <div v-else-if="type === 'releases'" class="flex items-center justify-end">
    {{ lib.npmReleases }}
  </div>

  <div v-else-if="type === 'commits'" class="flex items-center justify-end">
    {{ lib.commits }}
  </div>

  <div
    v-else-if="type === 'contributors'"
    class="flex items-center justify-end"
  >
    {{ lib.contributors }}
  </div>

  <div
    v-else-if="type === 'dependencies'"
    class="flex items-center justify-end"
  >
    {{ lib.dependencies }}
  </div>

  <div v-else-if="type === 'ts'" class="flex items-center justify-center">
    {{ lib.tsSupport || '-' }}
  </div>

  <div v-else-if="type === 'bundlesize'" class="flex items-center justify-end">
    {{ getBundleSize(lib) }}
  </div>

  <div v-else-if="type === 'age'" class="flex items-center justify-center">
    {{ getAge(lib.createdAt) }}
  </div>

  <div v-else-if="type === 'license'" class="flex items-center justify-center">
    {{ lib.license }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import { MetricT, LibT } from './Report.vue';
import { numbersFormatter } from '@/utils';

export default defineComponent({
  name: 'ReportMetricValue',

  props: {
    type: {
      type: String as () => MetricT,
      required: true,
    },
    lib: {
      type: Object as () => LibT,
      required: true,
    },
  },

  setup() {
    return {
      getAge(createdAt: string): string {
        return formatDistanceToNowStrict(new Date(createdAt));
      },
      formatNumber(stars: number): string {
        return numbersFormatter.format(stars);
      },
      getBundleSize(lib: LibT): string {
        if (!lib.bundleSize) {
          return '';
        }
        if (lib.repo === 'facebook/react') {
          return '42.3 kB *';
        }
        // @ts-ignore
        return `${Math.round(lib.bundleSize.gzip / 102.4) / 10} kB`;
      },
    };
  },
});
</script>

<style lang="postcss" scoped></style>
