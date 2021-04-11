<template>
  <div class="flex items-center">
    <template v-if="type === 'starsTotal'">{{ lib.starsTotal }}</template>

    <template v-else-if="type === 'starsPlus'">
      {{ lib.starsPlus }}
    </template>

    <template v-else-if="type === 'starsPlusPercentage'">
      {{ lib.starsPlusPercentage }}
    </template>

    <template v-else-if="type === 'downloads'">
      {{ lib.dwnlMonthly }}
    </template>

    <template v-else-if="type === 'downloadsIncrease'">
      {{ lib.dwnlMonthlyIncreasePercentage }}
    </template>

    <template v-else-if="type === 'searchInterest'">
      {{ lib.googleTrends || '-' }}
    </template>

    <template v-else-if="type === 'devusage'">
      {{ lib.devUsage }}
    </template>

    <template v-else-if="type === 'tradar'">
      {{ (lib.techRadar && lib.techRadar.level) || '-' }}
    </template>

    <template v-else-if="type === 'releases'">
      {{ lib.npmReleases }}
    </template>

    <template v-else-if="type === 'commits'">
      {{ lib.commits }}
    </template>

    <template v-else-if="type === 'contributors'">
      {{ lib.contributors }}
    </template>

    <template v-else-if="type === 'dependencies'">
      {{ lib.dependencies }}
    </template>

    <template v-else-if="type === 'ts'">
      {{ lib.tsSupport }}
    </template>

    <template v-else-if="type === 'bundlesize'">
      {{ lib.bundleSize && lib.bundleSize.gzip }}
    </template>

    <template v-else-if="type === 'age'">
      {{ getAge(lib.createdAt) }}
    </template>

    <template v-else-if="type === 'license'">
      {{ lib.license }}
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import { MetricT, LibT } from './Report.vue';

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
    };
  },
});
</script>

<style lang="postcss" scoped></style>
