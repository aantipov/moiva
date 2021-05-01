<template>
  <div v-if="type === 'npm'" class="flex justify-end">
    {{ lib.npmPackage.name }}
  </div>

  <div v-if="type === 'repo'" class="flex justify-end">
    {{ lib.repo.repoId }}
  </div>

  <div v-if="type === 'stars'" class="flex justify-end">
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
  <!--  -->
  <!-- <div v&#45;else&#45;if="type === 'tradar'" class="flex items&#45;center justify&#45;center"> -->
  <!--   <a v&#45;if="lib.techRadar" :href="lib.techRadar.url" target="_blank">{{ -->
  <!--     lib.techRadar.level -->
  <!--   }}</a> -->
  <!--   <template v&#45;else> &#45; </template> -->
  <!-- </div> -->
  <!--  -->
  <!-- <div v&#45;else&#45;if="type === 'releases'" class="flex items&#45;center justify&#45;end"> -->
  <!--   {{ lib.npmReleases }} -->
  <!-- </div> -->
  <!--  -->
  <!-- <div v&#45;else&#45;if="type === 'commits'" class="flex items&#45;center justify&#45;end"> -->
  <!--   {{ lib.commits }} -->
  <!-- </div> -->
  <!--  -->
  <!-- <div -->
  <!--   v&#45;else&#45;if="type === 'contributors'" -->
  <!--   class="flex items&#45;center justify&#45;end" -->
  <!-- > -->
  <!--   {{ lib.contributors }} -->
  <!-- </div> -->

  <div
    v-else-if="type === 'dependencies'"
    class="flex items-center justify-end"
  >
    {{ lib.npmPackage.dependencies.length }}
  </div>

  <div v-else-if="type === 'ts'" class="flex items-center justify-center">
    <TsBundledIcon v-if="lib.npmPackage.hasBuiltinTypes" />
    <TsDtIcon v-else-if="lib.npmPackage.hasOtherTypes" />
    <template v-else>{{ '-' }}</template>
  </div>

  <!-- <div v&#45;else&#45;if="type === 'bundlesize'" class="flex items&#45;center justify&#45;end"> -->
  <!--   {{ getBundleSize(lib) }} -->
  <!-- </div> -->

  <div v-else-if="type === 'security'" class="flex items-center justify-center">
    <object
      :id="'badge-' + lib.npmPackage.name"
      v-tooltip="'Snyk Security Score badge. \'A\' means no vulnerabilities.'"
      :data="snykUrl"
      type="image/svg+xml"
      style="max-width: 131px; max-height: 20px"
    ></object>
  </div>

  <div v-else-if="type === 'age'" class="flex items-center justify-center">
    {{ getAge(lib.repo.createdAt) }}
  </div>

  <div v-else-if="type === 'license'" class="flex items-center justify-center">
    {{ lib.npmPackage.license }}
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import { LibraryT } from '@/libraryApis';
import { numbersFormatter } from '@/utils';
import TsBundledIcon from '@/icons/TsBundled.vue';
import TsDtIcon from '@/icons/TsDt.vue';
// import { repoToTechRadarMap } from '../../../techradar.config';
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
      type: Object as () => LibraryT,
      required: true,
    },
  },

  setup(props) {
    const { lib } = toRefs(props);

    return {
      getAge(createdAt: string): string {
        return formatDistanceToNowStrict(new Date(createdAt));
      },
      formatNumber(stars: number): string {
        return numbersFormatter.format(stars);
      },
      snykUrl: computed(() =>
        lib.value.npmPackage
          ? `https://snyk-widget.herokuapp.com/badge/npm/${encodeURIComponent(
              lib.value.npmPackage.name
            )}/badge.svg`
          : ''
      ),
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

<style lang="postcss">
.sec {
  @apply flex items-center justify-center w-6 h-5 text-white rounded font-mono text-sm no-underline;
}
.sec-A {
  background-color: #4c1;
}
.sec-C {
  background-color: #fe7d37;
}
.sec-E,
.sec-F {
  background-color: #e05d44;
}
</style>
