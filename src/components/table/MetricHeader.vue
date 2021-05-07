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
      <div v-tooltip="'GitHub repository'" class="label">GitHub</div>
    </template>

    <template v-if="type === 'stars'">
      <StarIcon
        v-tooltip="'A total number of GitHub stars'"
        class="w-8"
        label="A total number of GitHub stars"
      />
      <div v-tooltip="'A total number of GitHub stars'" class="label">
        Stars
      </div>
    </template>

    <!-- <template v&#45;else&#45;if="type === 'starsPlus'"> -->
    <!--   <StarIcon /> -->
    <!--   <div class="ml&#45;2">New Stars</div> -->
    <!-- </template> -->

    <!-- <template v&#45;else&#45;if="type === 'starsPlusPercentage'"> -->
    <!--   <StarIcon /> -->
    <!--   <div class="ml&#45;2">New Stars, %</div> -->
    <!-- </template> -->

    <template v-else-if="type === 'downloads'">
      <DownloadIcon
        v-tooltip="'Monthly downloads of the npm package'"
        class="w-8"
        label="Monthly downloads of the npm package"
      />
      <div v-tooltip="'Monthly downloads of the npm package'" class="label">
        Monthly
      </div>
    </template>

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
        v-tooltip="tradarTooltip"
        class="w-8 h-3"
        :label="tradarTooltip"
      />
      <div v-tooltip="tradarTooltip" class="label">Tech Radar</div>
    </template>

    <template v-else-if="type === 'releases'">
      <TagIcon
        v-tooltip="npmReleasesTooltip"
        class="w-8"
        :label="npmReleasesTooltip"
      />
      <div v-tooltip="npmReleasesTooltip" class="label whitespace-nowrap">
        Npm releases
        <span class="text-sm font-normal opacity-80">in {{ quarter }}</span>
      </div>
    </template>

    <template v-else-if="type === 'commits'">
      <CommitsIcon
        v-tooltip="commitsTooltip"
        class="flex-shrink-0 w-8"
        :label="commitsTooltip"
      />
      <div v-tooltip="commitsTooltip" class="label">
        Commits
        <span class="text-sm font-normal opacity-80">in {{ quarter }}</span>
      </div>
    </template>

    <template v-else-if="type === 'contributors'">
      <WorkerIcon
        v-tooltip="contributorsTooltip"
        class="flex-shrink-0 w-8"
        :label="contributorsTooltip"
      />
      <div v-tooltip="contributorsTooltip" class="label whitespace-nowrap">
        Contributors
        <span class="text-sm font-normal opacity-80">in {{ quarter }}</span>
      </div>
    </template>

    <template v-else-if="type === 'dependencies'">
      <DependencyIcon
        v-tooltip="'Npm dependencies number'"
        class="w-8"
        label="Npm dependencies number"
      />
      <div v-tooltip="'Npm dependencies number'" class="label">
        Dependencies
      </div>
    </template>

    <template v-else-if="type === 'ts'">
      <div class="flex justify-center w-8">
        <TSIcon v-tooltip="tsTooltip" label="TypeScript support" />
      </div>
      <div v-tooltip="tsTooltip" class="label">Types</div>
    </template>

    <!-- <template v&#45;else&#45;if="type === 'bundlesize'"> -->
    <!--   <CubeIcon /> -->
    <!--   <div class="ml&#45;2">Bundle Size</div> -->
    <!-- </template> -->

    <template v-else-if="type === 'security'">
      <ShieldIcon v-tooltip="snykTooltip" class="w-8" label="Security" />
      <div v-tooltip="snykTooltip" class="label">Security</div>
    </template>

    <template v-else-if="type === 'age'">
      <OldIcon v-tooltip="'Age'" class="w-8" label="Age" />
      <div v-tooltip="'Age'" class="label">Age</div>
    </template>

    <template v-else-if="type === 'license'">
      <DocumentIcon v-tooltip="'License'" class="w-8" label="License" />
      <div v-tooltip="'License'" class="label">License</div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import GitHubIcon from '@/components/icons/Github.vue';
import StarIcon from '@/components/icons/Star.vue';
import DownloadIcon from '@/components/icons/Download.vue';
import TagIcon from '@/components/icons/Tag.vue';
// import SearchIcon from '@/components/icons/Search.vue';
import WorkerIcon from '@/components/icons/Worker.vue';
import OldIcon from '@/components/icons/Old.vue';
import DocumentIcon from '@/components/icons/Document.vue';
import TSIcon from '@/components/icons/TS.vue';
// import UserGroupIcon from '@/components/icons/UserGroup.vue';
import CommitsIcon from '@/components/icons/Commits.vue';
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
    DownloadIcon,
    TagIcon,
    // UserGroupIcon,
    CommitsIcon,
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
      contributorsTooltip: `Contributors number in ${prevQuarter}`,
      npmReleasesTooltip: `Npm releases number in ${prevQuarter}`,
      commitsTooltip: `Repository commits number in ${prevQuarter}`,
      tradarTooltip:
        'A ThoughtWorks tech radar “ring” assigned to the library. Four possible rings - “Adopt”, “Trial”, “Assess”, and “Hold”.',
    };
  },
});
</script>

<style lang="postcss" scoped>
.label {
  @apply hidden sm:block sm:ml-1;
}
</style>
