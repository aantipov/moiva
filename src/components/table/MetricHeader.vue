<template>
  <div
    class="flex items-center justify-center sm:justify-start whitespace-nowrap"
  >
    <template v-if="type === 'npm'">
      <div class="sm:ml-9">Npm</div>
    </template>

    <template v-if="type === 'repo'">
      <m-github-icon
        v-tooltip.html="github"
        class="w-8"
        label="GitHub repository"
      />
      <div v-tooltip.html="github" class="label">GitHub</div>
    </template>

    <template v-if="type === 'status'">
      <HeartBeatIcon
        v-tooltip.html="status"
        class="w-8"
        label="An icon denoting a status of a library"
      />
      <div v-tooltip.html="status" class="label">Status</div>
    </template>

    <template v-if="type === 'stars'">
      <m-star-icon v-tooltip="stars" class="w-8" :label="stars" />
      <div v-tooltip="stars" class="text-left label">
        <div>
          Stars
          <span class="text-sm font-normal opacity-80">in total</span>
        </div>
        <div class="text-sm font-normal opacity-80">and monthly growth</div>
      </div>
    </template>

    <template v-else-if="type === 'downloads'">
      <m-download-icon
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
        v-tooltip.html="devUsageInfo"
        class="w-8"
        label="An icon denoting percentage of developers using a library"
      />
      <div v-tooltip.html="devUsageInfo" class="label">Developer Usage, %</div>
    </template>

    <template v-else-if="type === 'tradar'">
      <TWIcon
        v-tooltip.html="tradarTooltip"
        class="w-8 h-3"
        label="An icon denoting Thoughtworks techradar ring assigned to a library"
      />
      <div v-tooltip.html="tradarTooltip" class="label">Tech Radar</div>
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
        <TSIcon
          v-tooltip.html="tsTooltip"
          label="An icon denoting TypeScript support"
        />
      </div>
      <div v-tooltip.html="tsTooltip" class="label">Types</div>
    </template>

    <template v-else-if="type === 'bundlesize'">
      <CubeIcon
        v-tooltip.html="bundlesize"
        class="w-8"
        label="An icon denoting bundle size of an npm package"
      />
      <div v-tooltip.html="bundlesize" class="label">Bundle Size</div>
    </template>

    <template v-else-if="type === 'security'">
      <ShieldIcon
        v-tooltip.html="secScore"
        class="w-8"
        label="An icon denoting Security Score of an Npm package"
      />
      <div v-tooltip.html="secScore" class="label">Security score</div>
    </template>

    <template v-else-if="type === 'vulnerability'">
      <BugIcon
        v-tooltip.html="vulnInfo"
        class="w-8"
        label="An icon denoting vulnerabilities number of an Npm package"
      />
      <div v-tooltip.html="vulnInfo" class="label">Vulnerabilities</div>
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
    SearchIcon,
    WorkerIcon,
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
      github: 'GitHub repository',
      status:
        '<p>Library status. Possible values:</p><p>- "Active"<br> - "Inactive" if no commits in the last 6 months<br> - "Legacy" if library authors called it so<br> - "Archived" if the repository is archived</p>',
      stars:
        'The total number of GitHub stars and the average number of new stars per month over the last 3 months',
      npmDownloads:
        'The average number of Npm downloads per month over the last 3 months. The average monthly Npm downloads growth over the last 6 months',
      tsTooltip:
        '<p>TypeScript support.</p> <p>"BUNDLED" - typings are bundled together with the package.</p> <p>"SEPARATE" - typings are published to the @types organization on Npm</p>',
      secScore:
        '<p>Security score of the Npm package.</p> <p><a href="https://snyk.io/" target="_blank">Snyk.io</a> calculates it based on the number of vulnerabilities and their severity.</p> "A" - no vulnerabilities, "F" - the least secure level.',
      vulnInfo:
        '<p>Vulnerabilities found in the repository.</p> <p>Data source: <a href="https://snyk.io/" target="_blank">Snyk.io</a></p>',
      contributorsTooltip: `Contributors number in ${prevQuarter}`,
      npmReleasesTooltip: `Npm releases number in ${prevQuarter}`,
      commitsTooltip: `Repository commits number in ${prevQuarter}`,
      tradarTooltip:
        '<p>A ThoughtWorks tech radar “ring” assigned to the library.</p> <p>Four possible rings - “Adopt”, “Trial”, “Assess”, and “Hold”.</p>',
      searchInfo:
        'An average Google search interest in relation to other libraries.',
      devUsageInfo:
        'Percentage of developers using the library according to the latest <a href="https://stateofjs.com/" target="_blank">StateOfJS 2020</a> survey',
      bundlesize:
        'Bundle size of the npm package minified+gzipped. Data source: <a href="https://bundlephobia.com/" target="_blank">Bundlephobia.com</a>',
    };
  },
});
</script>

<style lang="postcss" scoped>
.label {
  @apply hidden sm:block sm:ml-1;
}
</style>
