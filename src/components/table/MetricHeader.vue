<template>
  <div class="flex items-center">
    <template v-if="type === 'npm'">
      <div class="ml-2">Npm</div>
    </template>

    <template v-if="type === 'repo'">
      <div class="ml-2">GitHub</div>
    </template>

    <template v-if="type === 'stars'">
      <StarIcon />
      <div class="ml-2">Stars</div>
    </template>

    <!-- <template v&#45;else&#45;if="type === 'starsPlus'"> -->
    <!--   <StarIcon /> -->
    <!--   <div class="ml&#45;2">New Stars</div> -->
    <!-- </template> -->
    <!--  -->
    <!-- <template v&#45;else&#45;if="type === 'starsPlusPercentage'"> -->
    <!--   <StarIcon /> -->
    <!--   <div class="ml&#45;2">New Stars, %</div> -->
    <!-- </template> -->
    <!--  -->
    <!-- <template v&#45;else&#45;if="type === 'downloads'"> -->
    <!--   <DownloadIcon /> -->
    <!--   <div class="ml&#45;2">Monthly</div> -->
    <!-- </template> -->
    <!--  -->
    <!-- <template v&#45;else&#45;if="type === 'downloadsIncrease'"> -->
    <!--   <DownloadIcon /> -->
    <!--   <div class="ml&#45;2">Monthly % (incr.)</div> -->
    <!-- </template> -->
    <!--  -->
    <!-- <template v&#45;else&#45;if="type === 'searchInterest'"> -->
    <!--   <SearchIcon /> -->
    <!--   <div class="ml&#45;2">Search Interest, %</div> -->
    <!-- </template> -->

    <!-- <template v&#45;else&#45;if="type === 'devusage'"> -->
    <!--   <UserGroupIcon /> -->
    <!--   <div class="ml&#45;2">Developer Usage, %</div> -->
    <!-- </template> -->
    <!--  -->
    <!-- <template v&#45;else&#45;if="type === 'tradar'"> -->
    <!--   <TWIcon class="w&#45;5 dark" /> -->
    <!--   <div class="ml&#45;2">Tech Radar</div> -->
    <!-- </template> -->
    <!--  -->
    <!-- <template v&#45;else&#45;if="type === 'releases'"> -->
    <!--   <TagIcon /> -->
    <!--   <div class="ml&#45;2">Releases</div> -->
    <!-- </template> -->

    <!-- <template v&#45;else&#45;if="type === 'commits'"> -->
    <!--   <CommitsIcon /> -->
    <!--   <div class="ml&#45;2">Commits</div> -->
    <!-- </template> -->
    <!--  -->
    <!-- <template v&#45;else&#45;if="type === 'contributors'"> -->
    <!--   <WorkerIcon /> -->
    <!--   <div class="ml&#45;2">Contributors</div> -->
    <!-- </template> -->

    <template v-else-if="type === 'dependencies'">
      <DependencyIcon />
      <div class="ml-2">Dependencies</div>
    </template>

    <template v-else-if="type === 'ts'">
      <div class="flex justify-center w-5">
        <TSIcon />
      </div>
      <div class="ml-2">Types</div>
    </template>

    <!-- <template v&#45;else&#45;if="type === 'bundlesize'"> -->
    <!--   <CubeIcon /> -->
    <!--   <div class="ml&#45;2">Bundle Size</div> -->
    <!-- </template> -->

    <template v-else-if="type === 'security'">
      <ShieldIcon />
      <div class="ml-2">Security</div>
    </template>

    <template v-else-if="type === 'age'">
      <OldIcon />
      <div class="ml-2">Age</div>
    </template>

    <template v-else-if="type === 'license'">
      <DocumentIcon />
      <div class="ml-2">License</div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import StarIcon from '@/components/icons/Star.vue';
import DownloadIcon from '@/components/icons/Download.vue';
import TagIcon from '@/components/icons/Tag.vue';
import SearchIcon from '@/components/icons/Search.vue';
import WorkerIcon from '@/components/icons/Worker.vue';
import OldIcon from '@/components/icons/Old.vue';
import DocumentIcon from '@/components/icons/Document.vue';
import TSIcon from '@/components/icons/TS.vue';
import UserGroupIcon from '@/components/icons/UserGroup.vue';
import CommitsIcon from '@/components/icons/Commits.vue';
import TWIcon from '@/components/icons/Thoughtworks.vue';
import CubeIcon from '@/components/icons/Cube.vue';
import DependencyIcon from '@/components/icons/Dependency.vue';
import ShieldIcon from '@/components/icons/Shield.vue';
import { MetricT } from './Table.vue';

export default defineComponent({
  name: 'ReportMetricHeader',

  components: {
    StarIcon,
    SearchIcon,
    WorkerIcon,
    DownloadIcon,
    TagIcon,
    UserGroupIcon,
    CommitsIcon,
    DocumentIcon,
    DependencyIcon,
    CubeIcon,
    OldIcon,
    ShieldIcon,
    TWIcon,
    TSIcon,
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
