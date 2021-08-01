<template>
  <m-chart
    v-if="isDisplayed"
    title="Bundle size,"
    subtitle="kB"
    :is-loading="isLoading"
    :is-error="isError"
    :libs-names="packagesNames"
    :failed-libs-names="failedPackagesNames"
    :chart-config="chartConfig"
    :aria-label="ariaLabel"
  >
    <p>Bundle size per NPM package.</p>
    <p v-if="moreInfo">{{ moreInfo }}</p>
    <p>
      Data source:
      <a href="https://bundlephobia.com/" target="_blank">Bundlephobia</a>
    </p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed, watchEffect, PropType } from 'vue';
import { ChartConfiguration } from 'chart.js';
import { BundlephobiaT } from './api';
import { numbersFormatter, roundBytesFn } from '@/utils';
import whitelistedCategories from './whitelist.json';
import {
  COLOR_GREEN,
  COLOR_GRAY,
  COLOR_GRAY_DARK,
  COLOR_GREEN_DARK,
} from '@/colors';
import { NpmPackageT, LibraryReadonlyT } from '@/libraryApis';
import { chartsVisibility } from '@/store/chartsVisibility';
import {
  librariesRR,
  isLoading as isLoadingLibraries,
} from '@/store/libraries';

interface FilteredLibT extends LibraryReadonlyT {
  npmPackage: NpmPackageT;
  bundlesize: BundlephobiaT;
}

export default defineComponent({
  name: 'BundlephobiaChart',

  props: {
    category: {
      type: null as unknown as PropType<string | null>,
      validator: (v: unknown) => typeof v === 'string' || v === null,
      required: true,
    },
  },

  setup(props) {
    const { category } = toRefs(props);

    const filteredLibsRef = computed(
      () => librariesRR.filter((lib) => !!lib.bundlesize) as FilteredLibT[]
    );

    const packagesNamesRef = computed(() =>
      filteredLibsRef.value.map((lib) => lib.npmPackage.name)
    );

    // It doesn't make sense to show the chart for all npm packages
    // Hence we display it only for packages belonging to specific
    // whitelisted categories or unknown categories
    watchEffect(() => {
      chartsVisibility.bundlephobia =
        filteredLibsRef.value.length > 0 &&
        (!category.value || whitelistedCategories.includes(category.value));
    });

    const chartConfig = computed<ChartConfiguration<'bar'>>(() => ({
      type: 'bar',
      data: {
        labels: packagesNamesRef.value,
        datasets: [
          {
            label: 'minified + gzipped',
            data: filteredLibsRef.value.map((lib) =>
              roundBytesFn(lib.bundlesize.gzip)
            ),
            backgroundColor: COLOR_GREEN,
            borderColor: COLOR_GREEN_DARK,
            borderWidth: 1,
          },
          {
            label: 'minified',
            data: filteredLibsRef.value.map((lib) =>
              roundBytesFn(lib.bundlesize.raw)
            ),
            backgroundColor: COLOR_GRAY,
            borderColor: COLOR_GRAY_DARK,
            borderWidth: 1,
          },
        ],
      },

      options: {
        scales: {
          y: {
            ticks: {
              beginAtZero: true,
              callback: (val) => numbersFormatter.format(val as number) + ' kB',
            },
          },
        },

        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) => {
                return ` ${ctx.dataset.label}: ${Number(
                  ctx.raw
                ).toLocaleString()} kB`;
              },
            },
          },
        },
      },
    }));

    const isLoadingRef = computed(
      () =>
        isLoadingLibraries.value ||
        librariesRR.filter((lib) => lib.bundlesize === undefined).length > 0
    );

    return {
      isDisplayed: computed(() => chartsVisibility.bundlephobia),
      isLoading: isLoadingRef,
      isError: computed(() => filteredLibsRef.value.length === 0),
      packagesNames: packagesNamesRef,
      failedPackagesNames: computed<string[]>(() => {
        return isLoadingRef.value
          ? []
          : librariesRR
              .filter((lib) => !!lib.npmPackage && !lib.bundlesize)
              .map((lib) => (lib.npmPackage as NpmPackageT).name);
      }),
      chartConfig,
      ariaLabel: computed(() => {
        const str = filteredLibsRef.value
          .map(
            (lib) =>
              `The size of minified and gzipped ${
                lib.alias
              } npm package is ${roundBytesFn(lib.bundlesize.gzip)}Kb.`
          )
          .join(' ');
        return `Npm Bundle Size data. ${str}`;
      }),

      moreInfo: computed(() => {
        const reactLib = filteredLibsRef.value.find(
          (lib) => lib.npmPackage.name === 'react'
        );
        if (reactLib) {
          // @ts-ignore
          const reactSize = roundBytesFn(reactLib.bundlesize.react.gzip);
          // @ts-ignore
          const reactDomSize = roundBytesFn(reactLib.bundlesize.reactDom.gzip);
          return `React's size is comprised of 2 packages - react and react-dom. React: ${reactSize}kB (minified + gzipped). React-dom: ${reactDomSize}kB (minified + gzipped)`;
        }
        return null;
      }),
    };
  },
});
</script>
