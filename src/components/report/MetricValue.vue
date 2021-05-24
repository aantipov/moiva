<template>
  <div v-if="type === 'starsTotal'" class="flex justify-end">
    {{ formatNumber(lib.starsTotal) }}
  </div>

  <div v-else-if="type === 'starsPlus'" class="flex items-center justify-end">
    {{ formatNumber(lib.starsPlus) }}
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
    <a v-if="lib.techRadar" :href="lib.techRadar.url" target="_blank">{{
      lib.techRadar.level
    }}</a>
    <template v-else> - </template>
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

  <div v-else-if="type === 'security'" class="flex items-center justify-center">
    <a
      class="sec"
      :class="'sec-' + lib.security"
      :href="snykHref"
      target="_blank"
      >{{ lib.security || '-' }}</a
    >
  </div>

  <div v-else-if="type === 'age'" class="flex items-center justify-center">
    {{ getAge(lib.createdAt) }}
  </div>

  <div v-else-if="type === 'license'" class="flex items-center justify-center">
    {{ lib.license }}
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, toRefs } from 'vue';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import { MetricT, LibT } from './Report.vue';
import { numbersFormatter } from '@/utils';
import { repoToTechRadarMap } from '@/techradar.config';

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
    npm: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const { npm, lib } = toRefs(props);

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
      snykHref: computed(() => {
        return `https://snyk.io/advisor/npm-package/${npm.value}`;
      }),
      thoughtworksUrl: computed<string | null>(() => {
        const tradarItem = repoToTechRadarMap[lib.value.repo] || null;
        return tradarItem && tradarItem.link;
      }),
    };
  },
});
</script>

<style lang="postcss">
.sec {
  @apply flex items-center justify-center w-6 h-5 text-white rounded font-mono text-sm no-underline;
}
.sec-A {
  background-color: #4c1;
}
.sec-C {
  background-color: #fe7d37;
}
.sec-E,
.sec-F {
  background-color: #e05d44;
}
</style>
