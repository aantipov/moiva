<template>
  <div
    class="flex items-center justify-center sm:justify-start whitespace-nowrap"
  >
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

    <template v-if="type === 'status'">
      <HeartBeatIcon v-tooltip="status" class="w-8" label="status" />
      <div v-tooltip="status" class="label">Status</div>
    </template>

    <template v-if="type === 'stars'">
      <StarIcon v-tooltip="stars" class="w-8" :label="stars" />
      <div v-tooltip="stars" class="text-left label">
        <div>
          Stars
          <span class="text-sm font-normal opacity-80">in total</span>
        </div>
        <div class="text-sm font-normal opacity-80">and monthly growth</div>
      </div>
    </template>

    <template v-else-if="type === 'downloads'">
      <DownloadIcon
        v-tooltip="npmDownloads"
        class="w-8"
        :label="npmDownloads"
      />
      <div v-tooltip="npmDownloads" class="text-left label">
        <div>
          Npm Downloads
          <span class="text-sm font-normal opacity-80">monthly</span>
        </div>
        <div class="text-sm font-normal opacity-80">and monthly growth</div>
      </div>
    </template>

    <template v-else-if="type === 'searchInterest'">
      <SearchIcon v-tooltip="searchInfo" class="w-8" :label="searchInfo" />
      <div v-tooltip="searchInfo" class="label">Search Interest, %</div>
    </template>

    <template v-else-if="type === 'devusage'">
      <UserGroupIcon
        v-tooltip="devUsageInfo"
        class="w-8"
        :label="devUsageInfo"
      />
      <div v-tooltip="devUsageInfo" class="label">Developer Usage, %</div>
    </template>

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

    <template v-else-if="type === 'bundlesize'">
      <CubeIcon v-tooltip="bundlesize" class="w-8" :label="bundlesize" />
      <div v-tooltip="bundlesize" class="label">Bundle Size</div>
    </template>

    <template v-else-if="type === 'security'">
      <ShieldIcon v-tooltip="secScore" class="w-8" :label="secScore" />
      <div v-tooltip="secScore" class="label">Security score</div>
    </template>

    <template v-else-if="type === 'vulnerability'">
      <BugIcon v-tooltip="vulnInfo" class="w-8" :label="vulnInfo" />
      <div v-tooltip="vulnInfo" class="label">Vulnerabilities</div>
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
import BugIcon from '@/components/icons/Bug.vue';
import HeartBeatIcon from '@/icons/Heart.vue';
import { MetricT } from './Table.vue';
import { subQuarters, format } from 'date-fns';

const prevQuarter = format(subQuarters(new Date(), 1), 'yyyy-QQQ');

export default defineComponent({
  name: 'ReportMetricHeader',

  components: {
    GitHubIcon,
    StarIcon,
    SearchIcon,
    WorkerIcon,
    DownloadIcon,
    TagIcon,
    UserGroupIcon,
    CommitsIcon,
    DocumentIcon,
    DependencyIcon,
    HeartBeatIcon,
    CubeIcon,
    OldIcon,
    ShieldIcon,
    BugIcon,
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
      status:
        'Library status. Possible values: "Active",  "Inactive" if no commits in the last 6 months, "Legacy" if library authors called it so, "Archived" if the repository is archived',
      stars:
        'The total number of GitHub stars and the average number of new stars per month over the last 3 months',
      npmDownloads:
        'The average number of Npm downloads per month over the last 3 months. The average monthly Npm downloads growth over the last 6 months',
      tsTooltip:
        'TypeScript support. "Bundled" - typings are bundled together with the package. "Separate" - typings are published to the @types organization on Npm',
      secScore:
        'Security score of the Npm package. Snyk.io calculates it based on the number of vulnerabilities and their severity. "A" - no vulnerabilities, "F" - the least secure level.',
      vulnInfo: 'Vulnerabilities found in the repository. Data source: Snyk.io',
      contributorsTooltip: `Contributors number in ${prevQuarter}`,
      npmReleasesTooltip: `Npm releases number in ${prevQuarter}`,
      commitsTooltip: `Repository commits number in ${prevQuarter}`,
      tradarTooltip:
        'A ThoughtWorks tech radar “ring” assigned to the library. Four possible rings - “Adopt”, “Trial”, “Assess”, and “Hold”.',
      searchInfo:
        'An average Google search interest in relation to other libraries.',
      devUsageInfo:
        'Percentage of developers using the library according to the latest StateOfJS 2020 survey',
      bundlesize:
        'Bundle size of the npm package minified+gzipped. Data source: Bundlephobia.com',
    };
  },
});
</script>

<style lang="postcss" scoped>
.label {
  @apply hidden sm:block sm:ml-1;
}
</style>
