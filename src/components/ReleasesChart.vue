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
    <p>Moiva gets releases data from NPM...</p>
    <p>Major, minor and bugfix releases count.</p>
    <p>Pre-releases are not included.</p>
  </m-chart>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { ChartDataSets, ChartConfiguration } from 'chart.js';
import { NpmPackageReleasesT } from '../apis';
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

    const datasets = computed<ChartDataSets[]>(() =>
      packagesNames.value.map((packageName, packageIndex) => ({
        label: packageName,
        data: packagesReleases.value[
          packageIndex
        ].map(({ month, releases }) => ({ x: month, y: releases })),
        backgroundColor: packageToColorMap.value[packageName],
        borderColor: packageToColorMap.value[packageName],
      }))
    );

    const chartConfig = computed<ChartConfiguration>(() => ({
      type: 'line',
      data: { datasets: datasets.value },
      options: {
        scales: {
          adapters: { date: { locale: enUS } },
          xAxes: [{ type: 'time', time: { unit: 'year' } }],
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
        return `NPM Releases chart. The number of releases in the previous quarter - ${valuesStr}`;
      }),
    };
  },
});
</script>
