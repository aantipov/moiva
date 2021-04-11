<template>
  <div class="flex items-center">
    <template v-if="type === 'starsTotal'"><StarIcon /> Stars </template>

    <template v-else-if="type === 'starsPlus'">
      <StarIcon /> New Stars
    </template>

    <template v-else-if="type === 'starsPlusPercentage'">
      <StarIcon /> New Stars, %
    </template>

    <template v-else-if="type === 'downloads'">
      <DownloadIcon />
      <div>monthly</div>
    </template>

    <template v-else-if="type === 'downloadsIncrease'">
      <DownloadIcon />
      <div>monthly % (incr.)</div>
    </template>

    <template v-else-if="type === 'searchInterest'">
      <div>Search Interest, %</div>
    </template>

    <template v-else-if="type === 'devusage'">
      <div>Developer Usage, %</div>
    </template>

    <template v-else-if="type === 'tradar'">
      <div>Tech Radar</div>
    </template>

    <template v-else-if="type === 'releases'">
      <TagIcon />
      <div>Releases</div>
    </template>

    <template v-else-if="type === 'commits'">
      <div>Commits</div>
    </template>

    <template v-else-if="type === 'contributors'">
      <div>Contributors</div>
    </template>

    <template v-else-if="type === 'dependencies'">
      <div>Dependencies</div>
    </template>

    <template v-else-if="type === 'ts'">
      <div>TypeScript</div>
    </template>

    <template v-else-if="type === 'bundlesize'">
      <div>Bundle Size</div>
    </template>

    <template v-else-if="type === 'age'">
      <div>Age</div>
    </template>

    <template v-else-if="type === 'license'">
      <div>License</div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import { constructHref } from '@/utils';
// import GithubIcon from './icons/Github.vue';
import StarIcon from '@/components/icons/Star.vue';
import DownloadIcon from '@/components/icons/Download.vue';
import TagIcon from '@/components/icons/Tag.vue';
import { MetricT } from './Report.vue';

export default defineComponent({
  name: 'ReportMetricHeader',

  components: {
    // GithubIcon,
    StarIcon,
    DownloadIcon,
    TagIcon,
  },

  props: {
    type: {
      type: String as () => MetricT,
      required: true,
    },
  },

  setup() {
    return {};
  },
});
</script>

<style lang="postcss" scoped></style>
