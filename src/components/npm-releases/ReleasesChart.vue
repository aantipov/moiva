<template>
  <m-chart
    title="NPM Releases quarterly"
    :is-loading="isLoading"
    :is-error="isError"
    :libs-names="packagesNames"
    :failed-libs-names="failedPackagesNames"
    :chart-config="chartConfig"
    :aria-label="ariaLabel"
  >
    <p>New NPM Releases quarterly.</p>
    <p>Major, minor and bugfix releases count.</p>
    <p>Pre-releases are not included.</p>
    <p>Data source: <a href="https://www.npmjs.com/" target="_blank">NPM</a></p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { ChartDataSets, ChartConfiguration } from 'chart.js';
import { NpmPackageReleasesT } from './api';
import { enUS } from 'date-fns/locale';

export default defineComponent({
  name: 'NpmReleasesChart',

  props: {
    isLoading: { type: Boolean, required: true },
    isError: { type: Boolean, required: true },
    packagesNames: { type: Array as () => string[], required: true },
    failedPackagesNames: { type: Array as () => string[], required: true },
    packagesReleases: {
      type: Array as () => NpmPackageReleasesT[][],
      required: true,
    },
    packageToColorMap: {
      type: Object as () => Record<string, string>,
      required: true,
    },
  },

  setup(props) {
    const { packagesNames, packageToColorMap, packagesReleases } = toRefs(
      props
    );

    const itemsNum = computed(() => packagesNames.value.length);

    const datasets = computed<ChartDataSets[]>(() =>
      packagesNames.value.map((packageName, packageIndex) => ({
        label: packageName,
        fill: itemsNum.value === 1,
        data: packagesReleases.value[
          packageIndex
        ].map(({ month, releases }) => ({ x: month, y: releases })),
        backgroundColor: packageToColorMap.value[packageName],
        borderColor: packageToColorMap.value[packageName],
      }))
    );

    const unit = computed(() => {
      if (!packagesReleases.value.length) {
        return 'year';
      }
      const firstMonth = packagesReleases.value[0][0].month;
      return firstMonth >= '2019-10' ? 'quarter' : 'year';
    });

    const chartConfig = computed<ChartConfiguration>(() => ({
      type: 'line',
      data: { datasets: datasets.value },
      options: {
        scales: {
          adapters: { date: { locale: enUS } },
          xAxes: [{ type: 'time', time: { unit: unit.value } }],
          yAxes: [{}],
        },
      },
    }));

    return {
      chartConfig,
      ariaLabel: computed(() => {
        const valuesStr = packagesNames.value
          .map(
            (name, index) =>
              `${name}: ${packagesReleases.value[index].slice(-1)[0].releases}`
          )
          .join(', ');
        return `NPM Releases chart. The number of releases in the previous quarter - ${valuesStr} releases`;
      }),
    };
  },
});
</script>
