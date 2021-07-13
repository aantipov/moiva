<template>
  <div v-if="type === 'npm'" class="flex flex-col items-center">
    <template v-if="lib.npmPackage">
      <m-ext-link
        v-tooltip.html.ni="npmTooltip"
        :href="npmUrl"
        :txt="lib.npmPackage.name"
        truncate
      />
      <div class="text-sm opacity-80">v{{ lib.npmPackage.version }}</div>
    </template>
    <template v-else>-</template>
  </div>

  <div v-else-if="type === 'repo'" class="flex justify-center">
    <m-ext-link
      v-tooltip.html.ni="githubTooltip"
      :href="githubUrl"
      :txt="lib.repo.repoId"
      truncate
    />
  </div>

  <div v-else-if="type === 'status'" class="flex justify-center">
    <StatusBadge :value="lib.status" />
  </div>

  <div v-else-if="type === 'stars'">
    <div class="flex justify-end">
      {{ formatNumber(lib.repo.stars) }}
    </div>

    <div
      class="flex text-sm opacity-80"
      :class="{
        'justify-end': starsGrowth !== '-',
        'justify-center': starsGrowth === '-',
      }"
    >
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
      <m-ext-link :href="tradar.url" :txt="tradar.month" class="mt-1 text-sm" />
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
    :class="{ 'justify-end': !!contributors, 'justify-center': !contributors }"
  >
    {{ contributors?.contributors ?? '-' }}
  </div>

  <div
    v-else-if="type === 'dependencies'"
    class="flex items-center"
    :class="{
      'justify-end': !!lib.npmPackage,
      'justify-center': !lib.npmPackage,
    }"
  >
    {{ lib.npmPackage?.dependencies.length ?? '-' }}
  </div>

  <div v-else-if="type === 'ts'" class="flex items-center justify-center">
    <template v-if="lib.npmPackage">
      <type-badge v-if="lib.npmPackage.hasBuiltinTypes" value="bundled" />
      <type-badge
        v-else-if="lib.npmPackage.hasOtherTypes"
        value="separate"
        :types-package="lib.npmPackage.typesPackageName"
      />
      <template v-else>-</template>
    </template>
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
    {{ bundlesize }}
    <span
      v-if="lib.npmPackage && lib.npmPackage.name === 'react'"
      v-tooltip="'React’s bundle size includes react-dom package'"
      class="cursor-default"
      >*</span
    >
  </div>

  <div v-else-if="type === 'security'" class="flex items-center justify-center">
    <object
      v-if="lib.npmPackage"
      :id="'badge-' + lib.npmPackage.name"
      v-tooltip="'Snyk Security Score badge. \'A\' means no vulnerabilities.'"
      :data="snykUrl"
      type="image/svg+xml"
      style="max-width: 131px; max-height: 20px"
    ></object>
    <template v-else>-</template>
  </div>

  <div
    v-else-if="type === 'vulnerability'"
    class="flex items-center justify-center"
  >
    <a v-tooltip="vulnTooltip" :href="snykVulnUrl" target="_blank">
      <img
        :src="snykVulnUrl + 'badge.svg'"
        :alt="'Known ' + lib.alias + ' Vulnerabilities'"
        style="max-width: 131px; max-height: 20px"
      />
    </a>
  </div>

  <div v-else-if="type === 'age'" class="flex items-center justify-center">
    {{ getAge(lib.repo.createdAt) }}
  </div>

  <div v-else-if="type === 'license'" class="flex items-center justify-center">
    <LicenseBadge v-if="lib.license" :value="lib.license" />
    <template v-else> - </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import { LibraryReadonlyT } from '@/libraryApis';
import {
  numbersFormatter,
  formatPercent,
  formatNumber,
  sanitizeHTML,
} from '@/utils';
import { MetricT } from './Table.vue';
import { subQuarters, isSameQuarter } from 'date-fns';
import StatusBadge from '@/components/StatusBadge.vue';
import TRadarBadge from '@/components/TRadarBadge.vue';
import TypeBadge from '@/components/TypeBadge.vue';
import LicenseBadge from '@/components/LicenseBadge.vue';

const prevQuarterDate = subQuarters(new Date(), 1);
const roundBytesFn = (bytes: number): number => Math.round(bytes / 102.4) / 10;

export default defineComponent({
  name: 'ReportMetricValue',

  components: {
    StatusBadge,
    TRadarBadge,
    TypeBadge,
    LicenseBadge,
  },

  props: {
    type: {
      type: String as () => MetricT,
      required: true,
    },
    lib: {
      type: Object as () => LibraryReadonlyT,
      required: true,
    },
  },

  setup(props) {
    const { lib } = toRefs(props);
    const npmNameEncoded = computed(() =>
      encodeURIComponent(lib.value.npmPackage?.name ?? '')
    );

    return {
      npmTooltip: computed<string>(() => {
        return `<p class="f-mono">${
          lib.value.npmPackage?.name ?? ''
        }</p><p>${sanitizeHTML(lib.value.npmPackage?.description ?? '')}</p>`;
      }),
      githubTooltip: computed<string>(() => {
        return `<p class="f-mono">${lib.value.repo.repoId}</p><p>${sanitizeHTML(
          lib.value.repo.description
        )}</p>`;
      }),
      starsGrowth: computed<string>(() => {
        if (!lib.value.stars || !lib.value.repo.stars) {
          return '-';
        }

        const newStarsAvg = lib.value.starsNewAvg as number;

        if (newStarsAvg < 1) {
          return '0';
        }

        const total = lib.value.repo.stars - newStarsAvg;
        const percentage = (100 * newStarsAvg) / total;
        const percentageFormatted = numbersFormatter.format(percentage);

        return `${formatNumber(newStarsAvg, true)} = +${percentageFormatted}%`;
      }),

      npmDownloads: computed<string | null>(() => {
        if (!lib.value.npmDownloadsAvg) {
          return null;
        }

        return numbersFormatter.format(lib.value.npmDownloadsAvg);
      }),

      npmDownloadsGrowth: computed<string>(() => {
        return lib.value.npmDownloadsGrowth
          ? formatPercent(lib.value.npmDownloadsGrowth, true)
          : '-';
      }),

      getAge(createdAt: string): string {
        return formatDistanceToNowStrict(new Date(createdAt));
      },
      formatNumber(stars: number): string {
        return numbersFormatter.format(stars);
      },
      snykUrl: computed(
        () =>
          `https://snyk-widget.herokuapp.com/badge/npm/${npmNameEncoded.value}/badge.svg`
      ),
      snykVulnUrl: computed(
        () => `https://snyk.io/test/github/${lib.value.repo.repoId}/`
      ),
      vulnTooltip: computed(
        () =>
          `Vulnerabilities found in the ${lib.value.repo.repoId} repository. Data source: Snyk.io`
      ),
      npmUrl: computed(
        () => `https://www.npmjs.com/package/${npmNameEncoded.value}`
      ),
      githubUrl: computed(() => `https://github.com/${lib.value.repo.repoId}`),

      tradar: computed(() => {
        if (!lib.value.tradar) {
          return null;
        }

        return {
          ...lib.value.tradar.entries.slice(-1)[0],
          url: lib.value.tradar.link,
        };
      }),

      contributors: computed(() => {
        if (!lib.value.contributors) {
          return null;
        }
        return lib.value.contributors.slice(-1)[0];
      }),

      npmReleases: computed(() => {
        if (!lib.value.npmReleases) {
          return null;
        }
        return lib.value.npmReleases.slice(-1)[0];
      }),

      commits: computed<string | number>(() => {
        if (!lib.value.commits) {
          return '-';
        }

        // Get the numer of commits in the last quarter
        // Filter by the quarter and summarize
        return lib.value.commits
          .filter(({ week }) => isSameQuarter(week * 1000, prevQuarterDate))
          .reduce((acc, { total }) => acc + total, 0);
      }),

      devUsage: computed(() => {
        if (!lib.value.devUsage) {
          return null;
        }

        return lib.value.devUsage.usage.slice(-1)[0].value;
      }),

      searchInterest: computed<string>(() => {
        if (!lib.value.googleTrends || !lib.value.googleTrends.average) {
          return '-';
        }
        return lib.value.googleTrends.average + '%';
      }),

      bundlesize: computed<string>(() => {
        if (!lib.value.bundlesize) {
          return '-';
        }

        return roundBytesFn(lib.value.bundlesize.gzip) + ' kB';
      }),
    };
  },
});
</script>

<style lang="postcss">
.maxWidthCol {
  max-width: 140px;
}
</style>
