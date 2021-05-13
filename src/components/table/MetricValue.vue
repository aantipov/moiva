<template>
  <div v-if="type === 'npm'" class="flex flex-col items-center">
    <template v-if="lib.npmPackage">
      <a :href="npmUrl" target="_blank">{{ lib.npmPackage.name }}</a>
      <div class="text-sm opacity-80">v{{ lib.npmPackage.version }}</div>
    </template>
    <template v-else>-</template>
  </div>

  <div v-else-if="type === 'repo'" class="flex justify-center">
    <a
      v-tooltip="lib.repo.repoId"
      :href="githubUrl"
      class="truncate maxWidthCol"
      target="_blank"
      >{{ lib.repo.repoId }}</a
    >
  </div>

  <div v-else-if="type === 'stars'" class="flex justify-end">
    {{ formatNumber(lib.repo.stars) }}
  </div>

  <div
    v-else-if="type === 'starsPlus'"
    class="flex items-center"
    :class="{
      'justify-end': starsGrowth !== '-',
      'justify-center': starsGrowth === '-',
    }"
  >
    {{ starsGrowth }}
    <span class="ml-1 text-sm opacity-80">({{ starsGrowthPercentage }})</span>
  </div>

  <div
    v-else-if="type === 'downloads'"
    class="flex items-center"
    :class="{ 'justify-end': !!npmDownloads, 'justify-center': !npmDownloads }"
  >
    {{ npmDownloads ?? '-' }}
  </div>

  <div
    v-else-if="type === 'downloadsIncrease'"
    class="flex items-center"
    :class="{
      'justify-end': npmDownloadsGrowth !== '-',
      'justify-center': npmDownloadsGrowth === '-',
    }"
  >
    {{ npmDownloadsGrowth }}
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
      <a :href="tradar.url" target="_blank">{{ tradar.level }}</a>
      <div class="text-sm opacity-80">{{ tradar.month }}</div>
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
      <template v-if="lib.npmPackage.hasBuiltinTypes">
        <TsBundledIcon class="mr-2" />
        Bundled
      </template>
      <template v-else-if="lib.npmPackage.hasOtherTypes">
        <TsDtIcon class="mr-2" />
        Separate
      </template>
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
    <a :href="snykVulnUrl" target="_blank">
      <img :src="snykVulnUrl + '/badge.svg'" alt="Known Vulnerabilities" />
    </a>
  </div>

  <div v-else-if="type === 'age'" class="flex items-center justify-center">
    {{ getAge(lib.repo.createdAt) }}
  </div>

  <div v-else-if="type === 'license'" class="flex items-center justify-center">
    {{ lib.npmPackage?.license ?? '-' }}
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import { ReadonlyLibraryT } from '@/libraryApis';
import { numbersFormatter } from '@/utils';
import TsBundledIcon from '@/icons/TsBundled.vue';
import TsDtIcon from '@/icons/TsDt.vue';
import { MetricT } from './Table.vue';
import { subQuarters, isSameQuarter } from 'date-fns';

const prevQuarterDate = subQuarters(new Date(), 1);
const roundBytesFn = (bytes: number): number => Math.round(bytes / 102.4) / 10;

export default defineComponent({
  name: 'ReportMetricValue',

  components: {
    TsBundledIcon,
    TsDtIcon,
  },

  props: {
    type: {
      type: String as () => MetricT,
      required: true,
    },
    lib: {
      type: Object as () => ReadonlyLibraryT,
      required: true,
    },
  },

  setup(props) {
    const { lib } = toRefs(props);
    const npmNameEncoded = computed(() =>
      encodeURIComponent(lib.value.npmPackage?.name ?? '')
    );

    // avg number of new stars monthly (in the last 3 months)
    const newStarsAvg = computed<number>(() => {
      if (!lib.value.stars) {
        return 0;
      }

      return (
        lib.value.stars
          .slice(-3)
          .map((val) => val.stars)
          .reduce((acc, val) => acc + val, 0) / 3
      );
    });

    return {
      starsGrowth: computed<string>(() => {
        if (!lib.value.stars) {
          return '-';
        }
        if (newStarsAvg.value > 1) {
          return `+${numbersFormatter.format(newStarsAvg.value)}`;
        }

        return '<1';
      }),
      starsGrowthPercentage: computed<string>(() => {
        if (!lib.value.stars || !lib.value.repo.stars) {
          return '-';
        }

        const total = lib.value.repo.stars - newStarsAvg.value;
        const percentage = (100 * newStarsAvg.value) / total;
        const percentageFormatted = numbersFormatter.format(percentage);

        return `+${percentageFormatted}%`;
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

      npmDownloads: computed<string | null>(() => {
        if (!lib.value.npmDownloads) {
          return null;
        }
        const qDownloads = lib.value.npmDownloads
          .slice(-3)
          .map(({ downloads }) => downloads);
        const sum = qDownloads.reduce((sum, val) => sum + val, 0);

        return numbersFormatter.format(sum / qDownloads.length);
      }),

      npmDownloadsGrowth: computed<string>(() => {
        if (!lib.value.npmDownloads) {
          return '-';
        }
        const downloads = lib.value.npmDownloads.map((val) => val.downloads);
        const last = downloads.slice(-1)[0];
        const first = downloads.slice(-6, -5)[0];

        if (!first || !last) {
          return '-';
        }

        const perc = 100 * (Math.pow(last / first, 1 / 6) - 1);

        return `+${numbersFormatter.format(perc)}%`;
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
