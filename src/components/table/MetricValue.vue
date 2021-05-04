<template>
  <div v-if="type === 'npm'" class="flex flex-col items-center">
    <template v-if="lib.npmPackage">
      <a :href="npmUrl" target="_blank">{{ lib.npmPackage.name }}</a>
      <div class="text-sm opacity-80">v{{ lib.npmPackage.version }}</div>
    </template>
    <template v-else>-</template>
  </div>

  <div v-else-if="type === 'repo'" class="flex justify-center">
    <a :href="githubUrl" target="_blank">{{ lib.repo.repoId }}</a>
  </div>

  <div v-else-if="type === 'stars'" class="flex justify-end">
    {{ formatNumber(lib.repo.stars) }}
  </div>

  <!-- <div v&#45;else&#45;if="type === 'starsPlus'" class="flex items&#45;center justify&#45;end"> -->
  <!--   {{ formatNumber(lib.starsPlus) }} -->
  <!-- </div> -->
  <!--  -->
  <!-- <div -->
  <!--   v&#45;else&#45;if="type === 'starsPlusPercentage'" -->
  <!--   class="flex items&#45;center justify&#45;end" -->
  <!-- > -->
  <!--   {{ lib.starsPlusPercentage }}% -->
  <!-- </div> -->
  <!--  -->
  <!-- <div v&#45;else&#45;if="type === 'downloads'" class="flex items&#45;center justify&#45;end"> -->
  <!--   {{ formatNumber(lib.dwnlMonthly) }} -->
  <!-- </div> -->
  <!--  -->
  <!-- <div -->
  <!--   v&#45;else&#45;if="type === 'downloadsIncrease'" -->
  <!--   class="flex items&#45;center justify&#45;end" -->
  <!-- > -->
  <!--   {{ lib.dwnlMonthlyIncreasePercentage }}% -->
  <!-- </div> -->
  <!--  -->
  <!-- <div -->
  <!--   v&#45;else&#45;if="type === 'searchInterest'" -->
  <!--   class="flex items&#45;center justify&#45;end" -->
  <!-- > -->
  <!--   {{ (lib.googleTrends &#38;&#38; lib.googleTrends + '%') || '&#45;' }} -->
  <!-- </div> -->
  <!--  -->
  <!-- <div v&#45;else&#45;if="type === 'devusage'" class="flex items&#45;center justify&#45;end"> -->
  <!--   {{ (lib.devUsage &#38;&#38; lib.devUsage + '%') || '&#45;' }} -->
  <!-- </div> -->

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

  <!-- <div v&#45;else&#45;if="type === 'releases'" class="flex items&#45;center justify&#45;end"> -->
  <!--   {{ lib.npmReleases }} -->
  <!-- </div> -->
  <!--  -->
  <!-- <div v&#45;else&#45;if="type === 'commits'" class="flex items&#45;center justify&#45;end"> -->
  <!--   {{ lib.commits }} -->
  <!-- </div> -->
  <!--  -->
  <div
    v-else-if="type === 'contributors'"
    class="flex items-center justify-end"
  >
    <template v-if="contributors && !contributors.isError">
      {{ contributors.contributors }}
    </template>
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

  <!-- <div v&#45;else&#45;if="type === 'bundlesize'" class="flex items&#45;center justify&#45;end"> -->
  <!--   {{ getBundleSize(lib) }} -->
  <!-- </div> -->

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

    return {
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
        if (lib.value.contributors === undefined) {
          return null;
        }
        if (lib.value.contributors === null) {
          return { isError: true };
        }
        return lib.value.contributors.slice(-1)[0];
      }),

      // getBundleSize(lib: LibT): string {
      //   if (!lib.bundleSize) {
      //     return '';
      //   }
      //   if (lib.repo === 'facebook/react') {
      //     return '42.3 kB *';
      //   }
      //   // @ts-ignore
      //   return `${Math.round(lib.bundleSize.gzip / 102.4) / 10} kB`;
      // },
      // snykHref: computed(() => {
      //   return `https://snyk.io/advisor/npm-package/${npm.value}`;
      // }),
      // thoughtworksUrl: computed<string | null>(() => {
      //   const tradarItem = repoToTechRadarMap[lib.value.repo] || null;
      //   return tradarItem && tradarItem.link;
      // }),
    };
  },
});
</script>

<style lang="postcss"></style>
