<template>
  <div class="flex items-center">
    <template v-if="type === 'starsTotal'">
      <StarIcon />
      <div class="ml-1">Stars</div>
    </template>

    <template v-else-if="type === 'starsPlus'">
      <StarIcon />
      <div class="ml-1">New Stars</div>
    </template>

    <template v-else-if="type === 'starsPlusPercentage'">
      <StarIcon />
      <div class="ml-1">New Stars, %</div>
    </template>

    <template v-else-if="type === 'downloads'">
      <DownloadIcon />
      <div class="ml-1">monthly</div>
    </template>

    <template v-else-if="type === 'downloadsIncrease'">
      <DownloadIcon />
      <div class="ml-1">monthly % (incr.)</div>
    </template>

    <template v-else-if="type === 'searchInterest'">
      <SearchIcon />
      <div class="ml-1">Search Interest, %</div>
    </template>

    <template v-else-if="type === 'devusage'">
      <div>Developer Usage, %</div>
    </template>

    <template v-else-if="type === 'tradar'">
      <div>Tech Radar</div>
    </template>

    <template v-else-if="type === 'releases'">
      <TagIcon />
      <div class="ml-1">Releases</div>
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
import StarIcon from '@/components/icons/Star.vue';
import DownloadIcon from '@/components/icons/Download.vue';
import TagIcon from '@/components/icons/Tag.vue';
import SearchIcon from '@/components/icons/Search.vue';
import { MetricT } from './Report.vue';

export default defineComponent({
  name: 'ReportMetricHeader',

  components: {
    StarIcon,
    SearchIcon,
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
