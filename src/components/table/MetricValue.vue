<template>
  <div v-if="type === 'playground'" class="flex flex-wrap justify-center">
    <template v-if="lib.playground">
      <ExternalLink truncate :href="lib.playground" txt="Playground" />
    </template>
    <template v-else>-</template>
  </div>

  <div v-else-if="type === 'stars'">
    <div
      class="flex"
      :class="{
        'justify-end': starsGrowth !== '-',
        'justify-center': starsGrowth === '-',
      }"
    >
      {{ lib.repo ? formatNumber(lib.repo.stars) : '-' }}
    </div>

    <div
      class="flex text-sm opacity-80"
      :class="{
        'justify-end': starsGrowth !== '-',
        'justify-center': starsGrowth === '-',
      }"
    >
      <span v-if="showStarsGrowthBoostIcon" class="mr-1">&#128640;</span>
      {{ starsGrowth }}
    </div>
  </div>

  <div v-else-if="type === 'downloads'">
    <div
      class="flex"
      :class="{
        'justify-end': !!npmDownloads,
        'justify-center': !npmDownloads,
      }"
    >
      {{ npmDownloads ?? '-' }}
    </div>
    <div
      class="text-sm opacity-80"
      :class="{
        'text-right': npmDownloadsGrowth !== '-',
        'text-center': npmDownloadsGrowth === '-',
        'text-red-700': lib.npmDownloadsGrowth && lib.npmDownloadsGrowth < 0,
      }"
    >
      <span v-if="showNpmDownloadsGrowthBoostIcon" class="mr-1">&#128640;</span>
      {{ npmDownloadsGrowth }}
    </div>
  </div>

  <div
    v-else-if="type === 'searchInterest'"
    class="flex items-center"
    :class="{
      'justify-end': searchInterest !== '-',
      'justify-center': searchInterest === '-',
    }"
  >
    {{ searchInterest }}
  </div>

  <div
    v-else-if="type === 'devusage'"
    class="flex items-center"
    :class="{ 'justify-end': !!devUsage, 'justify-center': !devUsage }"
  >
    {{ (devUsage && devUsage + '%') || '-' }}
  </div>

  <div
    v-else-if="type === 'tradar'"
    class="flex flex-col items-center justify-center"
  >
    <template v-if="tradar">
      <t-radar-badge :value="tradar.level" />
      <ExternalLink
        :href="tradar.url"
        :txt="tradar.month"
        class="mt-1 text-sm"
      />
    </template>
    <template v-else> - </template>
  </div>

  <div
    v-else-if="type === 'releases'"
    class="flex items-center"
    :class="{ 'justify-end': !!npmReleases, 'justify-center': !npmReleases }"
  >
    {{ npmReleases?.releases ?? '-' }}
  </div>

  <div
    v-else-if="type === 'commits'"
    class="flex items-center"
    :class="{
      'justify-end': commits !== '-',
      'justify-center': commits === '-',
    }"
  >
    {{ commits }}
  </div>

  <div
    v-else-if="type === 'contributors'"
    class="flex items-center"
    :class="{
      'justify-end': contributors !== '-',
      'justify-center': contributors === '-',
    }"
  >
    {{ contributors }}
  </div>

  <div
    v-else-if="type === 'dependencies'"
    class="flex items-center"
    :class="{
      'justify-end': npmDependencies !== '-',
      'justify-center': npmDependencies === '-',
      'text-red-700': lib.npmDependencies && lib.npmDependencies > 10,
    }"
  >
    {{ npmDependencies }}
  </div>

  <div v-else-if="type === 'ts'" class="flex items-center justify-center">
    <type-badge v-if="lib.npm.hasBuiltinTypes" value="bundled" />
    <type-badge
      v-else-if="lib.npm.hasOtherTypes"
      value="separate"
      :types-package="lib.npm.typesPackageName"
    />
    <template v-else>-</template>
  </div>

  <div
    v-else-if="type === 'bundlesize'"
    class="flex items-center"
    :class="{
      'justify-end': bundlesize !== '-',
      'justify-center': bundlesize === '-',
    }"
  >
    <ExternalLink
      v-if="bundlesize !== '-'"
      :href="bundlephobiaUrl"
      :txt="bundlesize"
    />
    <span v-else>{{ bundlesize }}</span>
    <span
      v-if="lib.npm.name === 'react'"
      v-tooltip="'React’s bundle size includes react-dom package'"
      class="cursor-default"
      >*</span
    >
  </div>

  <div v-else-if="type === 'security'" class="flex items-center justify-center">
    <object
      :id="'badge-' + lib.npm.name"
      v-tooltip="'Snyk Security Score badge. \'A\' means no vulnerabilities.'"
      :data="snykUrl"
      type="image/svg+xml"
      style="max-width: 131px; max-height: 20px"
    ></object>
  </div>

  <div
    v-else-if="type === 'vulnerability'"
    class="flex items-center justify-center"
  >
    <template v-if="snykVulnUrl">
      <a v-tooltip="vulnTooltip" :href="snykVulnUrl" target="_blank">
        <img
          :src="snykVulnUrl + 'badge.svg'"
          :alt="'Known ' + lib.alias + ' Vulnerabilities'"
          style="max-width: 131px; max-height: 20px"
        />
      </a>
    </template>
    <template v-else>-</template>
  </div>

  <div v-else-if="type === 'age'" class="flex items-center justify-center">
    {{ getAge(lib.npm.createdAt) }}
  </div>

  <div v-else-if="type === 'license'" class="flex items-center justify-center">
    <LicenseBadge
      v-if="lib.license"
      :value="lib.license"
      :type="lib.licenseType"
    />
    <template v-else> - </template>
  </div>
</template>

<script setup lang="ts">
import ExternalLink from '@/components/ExternalLink.vue';
import { toRefs, computed } from 'vue';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import type { LibraryReadonlyT } from '@/libraryApis';
import { numbersFormatter, formatPercent, formatNumber } from '@/utils';
import type { MetricT } from './TableConfig';
import TRadarBadge from '@/components/TRadarBadge.vue';
import TypeBadge from '@/components/TypeBadge.vue';
import LicenseBadge from '@/components/LicenseBadge.vue';

const props = defineProps<{
  type: MetricT;
  lib: LibraryReadonlyT;
}>();

const { lib } = toRefs(props);
const npmNameEncoded = computed(() =>
  encodeURIComponent(lib.value.npmPackage.name),
);
const starsGrowth = computed<string>(() => {
  const { starsQuery, repo } = lib.value;

  if (!repo?.stars || !starsQuery?.data) {
    return '-';
  }

  if (starsQuery.data.monthlyAvg < 1) {
    return '0';
  }

  const percentageFormatted = numbersFormatter.format(starsQuery.data.growth);

  return `${formatNumber(
    starsQuery.data.monthlyAvg,
    true,
  )} / +${percentageFormatted}%`;
});

const showStarsGrowthBoostIcon = computed<boolean>(() => {
  const { starsQuery, repo } = lib.value;

  if (!repo?.stars || !starsQuery?.data) {
    return false;
  }

  const total = repo.stars - starsQuery.data.monthlyAvg;
  const growth = starsQuery.data.growth;
  return (
    (total > 100000 && growth > 3) ||
    (total > 50000 && growth > 5) ||
    (total > 10000 && growth > 8) ||
    (total > 5000 && growth > 10) ||
    (total > 1000 && growth > 15)
  );
});

const npmDownloads = computed<string | null>(() => {
  if (!lib.value.npmDownloadsAvg) {
    return null;
  }

  return numbersFormatter.format(lib.value.npmDownloadsAvg);
});

const npmDownloadsGrowth = computed<string>(() => {
  return lib.value.npmDownloadsGrowth
    ? formatPercent(lib.value.npmDownloadsGrowth, true)
    : '-';
});

const showNpmDownloadsGrowthBoostIcon = computed<boolean>(() => {
  const val = lib.value.npmDownloadsAvg;
  const growth = lib.value.npmDownloadsGrowth;
  if (!val || !growth) {
    return false;
  }
  return (
    (val > 1000000 && growth > 3) ||
    (val > 100000 && growth > 5) ||
    (val > 10000 && growth > 10)
  );
});

function getAge(createdAt: string): string {
  return formatDistanceToNowStrict(new Date(createdAt));
}

const snykUrl = computed(
  () =>
    `https://snyk-widget.herokuapp.com/badge/npm/${npmNameEncoded.value}/badge.svg`,
);
const snykVulnUrl = computed(() =>
  lib.value.repo
    ? `https://snyk.io/test/github/${lib.value.repo.repoId}/`
    : null,
);
const vulnTooltip = computed(() =>
  lib.value.repo
    ? `Vulnerabilities found in the ${lib.value.repo.repoId} repository. Data source: Snyk.io`
    : null,
);
const bundlephobiaUrl = computed(
  () => `https://bundlephobia.com/package/${npmNameEncoded.value}`,
);

const tradar = computed(() => {
  if (!lib.value.tradar) {
    return null;
  }

  return {
    ...lib.value.tradar.entries.slice(-1)[0],
    url: lib.value.tradar.link,
  };
});

const contributors = computed(() => lib.value.contributorsLastQ ?? '-');

const npmDependencies = computed(() => lib.value.npmDependencies ?? '-');

const npmReleases = computed(() => {
  if (!lib.value.npmReleases) {
    return null;
  }
  return lib.value.npmReleases.slice(-1)[0];
});

const commits = computed<string | number>(
  () => lib.value.commitsQuery?.data?.commitsLastQuarter ?? '-',
);

const devUsage = computed(() => {
  if (!lib.value.devUsage) {
    return null;
  }

  return lib.value.devUsage.usage.slice(-1)[0].value;
});

const searchInterest = computed<string>(() => {
  if (!lib.value.googleTrends?.data?.average) {
    return '-';
  }
  return lib.value.googleTrends.data.average + '%';
});

const bundlesize = computed<string>(() => {
  if (!lib.value.bundlesize) {
    return '-';
  }

  return lib.value.bundlesize.gzipKb + ' kB';
});
</script>

<style lang="postcss">
.maxWidthCol {
  max-width: 140px;
}
</style>
