<template>
  <div>
    <div ref="triggerRef" class="px-1 cursor-pointer">
      <m-chart-icon class="text-gray-600 hover:text-black" />
    </div>

    <div
      ref="contentRef"
      class="
        cursor-pointer
        text-gray-800
        font-normal
        -mx-2
        divide-gray-300 divide-y
      "
      @click="hide"
    >
      <div style="width: 500px; height: 350px">
        <m-chart
          title=""
          :is-loading="false"
          :is-error="false"
          :libs-names="libsNames"
          :failed-libs-names="[]"
          :chart-config="chartConfig"
          :aria-label="''"
          :show-title="false"
        >
          <p>NPM downloads monthly.</p>
          <p>
            Data source:
            <a href="https://www.npmjs.com/" target="_blank">NPM</a>
          </p>
        </m-chart>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import tippy, { Instance, roundArrow } from 'tippy.js';
import { MetricT } from './Table.vue';
import { ChartConfiguration } from 'chart.js';
import { descend, ascend, sort, path } from 'ramda';
import {
  getFormattedAgeFromAgeInMs,
  numbersFormatter,
  numbersStandardFormatter,
  roundBytesFn,
} from '@/utils';
import { librariesRR } from '@/store/libraries';

interface ConfigT {
  metric: MetricT;
  title: string;
  path: string;
  sortDirFn: () => unknown;
  percent?: boolean;
  bytes?: boolean;
}

const configs = [
  {
    metric: 'stars',
    title: 'GitHub Stars',
    path: 'repo.stars',
    sortDirFn: descend,
  },
  {
    metric: 'downloads',
    title: 'Npm Downloads, monthly',
    path: 'npmDownloadsAvg',
    sortDirFn: descend,
  },
  {
    metric: 'searchInterest',
    title: 'Search Interest, %',
    path: 'googleTrends.average',
    sortDirFn: descend,
    percent: true,
  },
  {
    metric: 'devusage',
    title: 'Developer Usage, %',
    path: 'devUsageLast',
    sortDirFn: descend,
    percent: true,
  },
  {
    metric: 'releases',
    title: 'Npm Releases in the previous quarter',
    path: 'npmReleasesLastQ',
    sortDirFn: descend,
  },
  {
    metric: 'commits',
    title: 'Commits in the previous quarter',
    path: 'commitsLastQ',
    sortDirFn: descend,
  },
  {
    metric: 'contributors',
    title: 'Contributors in the previous quarter',
    path: 'contributorsLastQ',
    sortDirFn: descend,
  },
  {
    metric: 'dependencies',
    title: 'Npm Dependencies',
    path: 'npmDependencies',
    sortDirFn: ascend,
  },
  {
    metric: 'bundlesize',
    title: 'Npm package bundle size (gzipped and modified), kB',
    path: 'bundlesize.gzip',
    sortDirFn: ascend,
    bytes: true,
  },
  {
    metric: 'age',
    title: 'Age',
    path: 'age',
    sortDirFn: descend,
  },
] as ConfigT[];

export default defineComponent({
  name: 'MetricChart',

  props: {
    type: {
      type: String as () => MetricT,
      required: true,
    },
  },

  setup(props) {
    const contentRef = ref(null);
    const triggerRef = ref(null);
    let t: Instance;

    const metricConfig = configs.find(
      (config) => config.metric === props.type
    ) as ConfigT;

    onMounted(() => {
      t = tippy(triggerRef.value as unknown as HTMLElement, {
        content: contentRef.value as unknown as HTMLElement,
        appendTo: () => document.body,
        trigger: 'click',
        arrow: roundArrow + roundArrow,
        delay: [0, 150],
        interactive: true,
        allowHTML: true,
        theme: 'metric-chart',
        hideOnClick: true,
      });
    });

    // @ts-ignore
    const sortFn = metricConfig.sortDirFn(path(metricConfig.path.split('.')));

    const librariesSortedRR = computed(() => {
      const filteredLibraries = librariesRR.filter(
        (lib) => path(metricConfig.path.split('.'), lib) !== undefined
      );
      // @ts-ignore
      return sort(sortFn, filteredLibraries);
    });

    const libsNamesRef = computed(() => {
      return librariesSortedRR.value.map((lib) => lib.alias);
    });

    return {
      triggerRef,
      contentRef,
      hide() {
        t.hide();
      },
      libsNames: libsNamesRef,

      // @ts-ignore
      chartConfig: computed<ChartConfiguration<'bar'>>(() => {
        return {
          type: 'bar',
          data: {
            labels: libsNamesRef.value,
            datasets: [
              {
                data: librariesSortedRR.value.map(
                  path(metricConfig.path.split('.'))
                ),
                backgroundColor: librariesSortedRR.value.map(
                  (lib) => lib.color
                ),
                borderColor: 'gray',
                borderWidth: 1,
              },
            ],
          },

          options: {
            scales: {
              y: {
                max: metricConfig.percent ? 100 : null,
                ticks: {
                  beginAtZero: true,
                  callback: (() => {
                    if (metricConfig.bytes) {
                      return roundBytesFn;
                    }
                    if (metricConfig.metric === 'age') {
                      return getFormattedAgeFromAgeInMs;
                    }
                    return numbersFormatter.format as () => string;
                  })(),
                },
              },
            },

            plugins: {
              legend: { display: false },
              title: {
                text: metricConfig.title,
                display: true,
                padding: { top: 0, bottom: 25 },
              },
              tooltip: {
                callbacks: {
                  label: (context): string => {
                    let val;
                    if (metricConfig.percent) {
                      // @ts-ignore
                      val = numbersStandardFormatter.format(context.raw) + '%';
                    } else if (metricConfig.bytes) {
                      // @ts-ignore
                      val = roundBytesFn(context.raw) + ' kB';
                    } else if (metricConfig.metric === 'age') {
                      // @ts-ignore
                      val = getFormattedAgeFromAgeInMs(context.raw);
                    } else {
                      // @ts-ignore
                      val = numbersStandardFormatter.format(context.raw);
                    }
                    return ` ${context.label}: ${val}`;
                  },
                },
              },
            },
          },
        };
      }),
    };
  },
});
</script>

<style lang="postcss">
.tippy-box[data-theme~='metric-chart'] {
  max-width: 80vw !important;
  max-height: 80vh !important;
  padding: 0px;
  @apply bg-gray-50 border-gray-200 border shadow;
}

/* The border */
.tippy-box[data-theme~='metric-chart'] > .tippy-svg-arrow > svg:first-child {
  @apply fill-current text-gray-800;
}

/* The fill */
.tippy-box[data-theme~='metric-chart'] > .tippy-svg-arrow > svg:last-child {
  @apply fill-current text-gray-50;
}
</style>
