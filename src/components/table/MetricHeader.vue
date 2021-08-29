<template>
  <div class="flex justify-between items-center">
    <div
      class="
        flex
        items-center
        justify-center
        sm:justify-start
        whitespace-nowrap
      "
    >
      <NpmIcon
        v-if="type === 'npm'"
        v-tooltip.html="row.tooltip"
        class="w-8 sm:hidden block"
        :label="row.label"
      />

      <m-github-icon
        v-if="type === 'repo'"
        v-tooltip.html="row.tooltip"
        class="w-8 sm:hidden block"
        :label="row.label"
      />

      <HeartBeatIcon
        v-if="type === 'status'"
        v-tooltip.html="row.tooltip"
        class="w-8 sm:hidden block"
        :label="row.label"
      />

      <m-star-icon
        v-if="type === 'stars'"
        v-tooltip="row.tooltip"
        class="w-8 sm:hidden block"
        :label="row.label"
      />

      <m-download-icon
        v-else-if="type === 'downloads'"
        v-tooltip="row.tooltip"
        class="w-8 sm:hidden block"
        :label="row.label"
      />

      <SearchIcon
        v-else-if="type === 'searchInterest'"
        v-tooltip="row.tooltip"
        class="w-8 sm:hidden block"
        :label="row.label"
      />

      <UserGroupIcon
        v-else-if="type === 'devusage'"
        v-tooltip.html="row.tooltip"
        class="w-8 sm:hidden block"
        :label="row.label"
      />

      <TWIcon
        v-else-if="type === 'tradar'"
        v-tooltip.html="row.tooltip"
        class="w-8 h-3 sm:hidden block"
        :label="row.label"
      />

      <TagIcon
        v-else-if="type === 'releases'"
        v-tooltip="row.tooltip"
        class="w-8 sm:hidden block"
        :label="row.label"
      />

      <CommitsIcon
        v-else-if="type === 'commits'"
        v-tooltip="row.tooltip"
        class="flex-shrink-0 w-8 sm:hidden block"
        :label="row.label"
      />

      <WorkerIcon
        v-else-if="type === 'contributors'"
        v-tooltip="row.tooltip"
        class="flex-shrink-0 w-8 sm:hidden block"
        :label="row.label"
      />

      <DependencyIcon
        v-else-if="type === 'dependencies'"
        v-tooltip="row.tooltip"
        class="w-8 sm:hidden block"
        :label="row.label"
      />

      <div v-else-if="type === 'ts'" class="flex justify-center w-8 sm:hidden">
        <TSIcon v-tooltip.html="row.tooltip" :label="row.label" />
      </div>

      <CubeIcon
        v-else-if="type === 'bundlesize'"
        v-tooltip.html="row.tooltip"
        class="w-8 sm:hidden block"
        :label="row.label"
      />

      <ShieldIcon
        v-else-if="type === 'security'"
        v-tooltip.html="row.tooltip"
        class="w-8 sm:hidden block"
        :label="row.label"
      />

      <BugIcon
        v-else-if="type === 'vulnerability'"
        v-tooltip.html="row.tooltip"
        class="w-8 sm:hidden block"
        :label="row.label"
      />

      <OldIcon
        v-else-if="type === 'age'"
        v-tooltip="row.tooltip"
        class="w-8 sm:hidden block"
        :label="row.label"
      />

      <DocumentIcon
        v-else-if="type === 'license'"
        v-tooltip="row.tooltip"
        class="w-8 sm:hidden block"
        :label="row.label"
      />

      <div v-tooltip.html="row.tooltip || row.label" class="text-left label">
        <div>
          {{ row.label }}

          <span v-if="row.labelSub" class="text-sm font-normal opacity-80">{{
            row.labelSub
          }}</span>
        </div>

        <div v-if="row.labelMore" class="text-sm font-normal opacity-80">
          {{ row.labelMore }}
        </div>
      </div>
    </div>

    <MetricChart v-if="hasChart" :type="type" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import TagIcon from '@/components/icons/TagIcon.vue';
import SearchIcon from '@/components/icons/SearchIcon.vue';
import WorkerIcon from '@/components/icons/WorkerIcon.vue';
import OldIcon from '@/components/icons/OldIcon.vue';
import DocumentIcon from '@/components/icons/DocumentIcon.vue';
import TSIcon from '@/components/icons/TSIcon.vue';
import UserGroupIcon from '@/components/icons/UserGroupIcon.vue';
import CommitsIcon from '@/components/icons/CommitsIcon.vue';
import TWIcon from '@/components/icons/ThoughtworksIcon.vue';
import CubeIcon from '@/components/icons/CubeIcon.vue';
import DependencyIcon from '@/components/icons/DependencyIcon.vue';
import ShieldIcon from '@/components/icons/ShieldIcon.vue';
import BugIcon from '@/components/icons/BugIcon.vue';
import NpmIcon from '@/icons/NpmIcon.vue';
import HeartBeatIcon from '@/icons/HeartBeatIcon.vue';
import MetricChart from './MetricChart.vue';
import { MetricT, MetricDataT } from './TableConfig';

const props = defineProps<{
  type: MetricT;
  row: MetricDataT;
}>();

const hasChart = computed(() => {
  return [
    'stars',
    'downloads',
    'searchInterest',
    'devusage',
    'releases',
    'commits',
    'contributors',
    'dependencies',
    'bundlesize',
    'age',
  ].includes(props.type);
});
</script>

<style lang="postcss" scoped>
.label {
  @apply hidden sm:block sm:ml-1;
}
</style>
