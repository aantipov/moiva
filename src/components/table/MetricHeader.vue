<template>
  <div class="flex items-center justify-center sm:justify-start">
    <template v-if="type === 'npm'">
      <div class="sm:ml-9">Npm</div>
    </template>

    <template v-if="type === 'repo'">
      <GitHubIcon
        v-tooltip="'GitHub repository'"
        class="w-8"
        label="GitHub repository"
      />
      <div class="label">GitHub</div>
    </template>

    <template v-if="type === 'stars'">
      <StarIcon
        v-tooltip="'A total number of GitHub stars'"
        class="w-8"
        label="A total number of GitHub stars"
      />
      <div class="label">Stars</div>
    </template>

    <!-- <template v&#45;else&#45;if="type === 'starsPlus'"> -->
    <!--   <StarIcon /> -->
    <!--   <div class="ml&#45;2">New Stars</div> -->
    <!-- </template> -->

    <!-- <template v&#45;else&#45;if="type === 'starsPlusPercentage'"> -->
    <!--   <StarIcon /> -->
    <!--   <div class="ml&#45;2">New Stars, %</div> -->
    <!-- </template> -->

    <!-- <template v&#45;else&#45;if="type === 'downloads'"> -->
    <!--   <DownloadIcon /> -->
    <!--   <div class="ml&#45;2">Monthly</div> -->
    <!-- </template> -->

    <!-- <template v&#45;else&#45;if="type === 'downloadsIncrease'"> -->
    <!--   <DownloadIcon /> -->
    <!--   <div class="ml&#45;2">Monthly % (incr.)</div> -->
    <!-- </template> -->

    <!-- <template v&#45;else&#45;if="type === 'searchInterest'"> -->
    <!--   <SearchIcon /> -->
    <!--   <div class="ml&#45;2">Search Interest, %</div> -->
    <!-- </template> -->

    <!-- <template v&#45;else&#45;if="type === 'devusage'"> -->
    <!--   <UserGroupIcon /> -->
    <!--   <div class="ml&#45;2">Developer Usage, %</div> -->
    <!-- </template> -->

    <template v-else-if="type === 'tradar'">
      <TWIcon
        v-tooltip="
          'A ThoughtWorks tech radar “ring” assigned to a library. Four possible rings - “Adopt”, “Trial”, “Assess”, and “Hold”.'
        "
        class="w-8 h-3"
        label="A ThoughtWorks tech radar “ring” assigned to a library"
      />
      <div class="label">Tech Radar</div>
    </template>

    <!-- <template v&#45;else&#45;if="type === 'releases'"> -->
    <!--   <TagIcon /> -->
    <!--   <div class="ml&#45;2">Releases</div> -->
    <!-- </template> -->

    <!-- <template v&#45;else&#45;if="type === 'commits'"> -->
    <!--   <CommitsIcon /> -->
    <!--   <div class="ml&#45;2">Commits</div> -->
    <!-- </template> -->

    <template v-else-if="type === 'contributors'">
      <WorkerIcon
        v-tooltip="contributorsTooltip"
        class="flex-shrink-0 w-8"
        :label="contributorsTooltip"
      />
      <div class="text-left label">
        Contributors
        <span class="text-sm font-normal text-opacity-80 whitespace-nowrap"
          >in {{ quarter }}</span
        >
      </div>
    </template>

    <template v-else-if="type === 'dependencies'">
      <DependencyIcon
        v-tooltip="'A number of Npm dependencies'"
        class="w-8"
        label="A number of Npm dependencies"
      />
      <div class="label">Dependencies</div>
    </template>

    <template v-else-if="type === 'ts'">
      <div class="flex justify-center w-8">
        <TSIcon v-tooltip="tsTooltip" label="TypeScript support" />
      </div>
      <div class="label">Types</div>
    </template>

    <!-- <template v&#45;else&#45;if="type === 'bundlesize'"> -->
    <!--   <CubeIcon /> -->
    <!--   <div class="ml&#45;2">Bundle Size</div> -->
    <!-- </template> -->

    <template v-else-if="type === 'security'">
      <ShieldIcon v-tooltip="snykTooltip" class="w-8" label="Security" />
      <div class="label">Security</div>
    </template>

    <template v-else-if="type === 'age'">
      <OldIcon v-tooltip="'Age'" class="w-8" label="Age" />
      <div class="label">Age</div>
    </template>

    <template v-else-if="type === 'license'">
      <DocumentIcon v-tooltip="'License'" class="w-8" label="License" />
      <div class="label">License</div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GitHubIcon from '@/components/icons/Github.vue';
import StarIcon from '@/components/icons/Star.vue';
// import DownloadIcon from '@/components/icons/Download.vue';
// import TagIcon from '@/components/icons/Tag.vue';
// import SearchIcon from '@/components/icons/Search.vue';
import WorkerIcon from '@/components/icons/Worker.vue';
import OldIcon from '@/components/icons/Old.vue';
import DocumentIcon from '@/components/icons/Document.vue';
import TSIcon from '@/components/icons/TS.vue';
// import UserGroupIcon from '@/components/icons/UserGroup.vue';
// import CommitsIcon from '@/components/icons/Commits.vue';
import TWIcon from '@/components/icons/Thoughtworks.vue';
// import CubeIcon from '@/components/icons/Cube.vue';
import DependencyIcon from '@/components/icons/Dependency.vue';
import ShieldIcon from '@/components/icons/Shield.vue';
import { MetricT } from './Table.vue';
import { subQuarters, format } from 'date-fns';

const prevQuarter = format(subQuarters(new Date(), 1), 'yyyy-QQQ');

export default defineComponent({
  name: 'ReportMetricHeader',

  components: {
    GitHubIcon,
    StarIcon,
    // SearchIcon,
    WorkerIcon,
    // DownloadIcon,
    // TagIcon,
    // UserGroupIcon,
    // CommitsIcon,
    DocumentIcon,
    DependencyIcon,
    // CubeIcon,
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
    return {
      quarter: prevQuarter,
      tsTooltip:
        'TypeScript support. "Bundled" - typings are bundled together with the package. "Separate" - typings are published to the @types organization on Npm',
      snykTooltip:
        'A calculated by Snyk level of security (from A to F) of Npm packages based on the number of vulnerabilities and their severity. "A" - no vulnerabilities, "F" - the least secure level.',
      contributorsTooltip: `A number of contributors in ${prevQuarter}`,
    };
  },
});
</script>

<style lang="postcss" scoped>
.label {
  @apply hidden sm:block sm:ml-1;
}
</style>
