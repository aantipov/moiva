<template>
  <canvas id="releaseFrequency"></canvas>
</template>

<script lang="ts">
import Vue from 'vue';
import Chart from 'chart.js';
// @ts-ignore
import { RepoT } from '../apis';
// @ts-ignore
import { appsConfigsMap } from '../../apps-config';

const years = [2017, 2018, 2019, 2020];

export default Vue.extend({
  name: 'GithubReleases',

  props: {
    apps: {
      type: Array as () => string[],
      required: true,
    },
    repos: {
      type: Array as () => RepoT[],
      required: true,
    },
  },

  mounted(): void {
    const ctx1 = document.getElementById(
      'releaseFrequency'
    ) as HTMLCanvasElement;

    const { apps, repos } = this;

    new Chart(ctx1, {
      type: 'line',

      data: {
        labels: years,
        datasets: apps.map((app, key) => ({
          label: app,
          fill: false,
          data: years.map((year) => repos[key].releases[year] || 0),
          backgroundColor: appsConfigsMap[app].color,
          borderColor: appsConfigsMap[app].color,
          spanGaps: true,
          borderWidth: 3,
          lineTension: 0,
          radius: 6,
          pointHoverRadius: 10,
        })),

        // return this.apps.map((app) => ({
        //   label: app,
        //   fill: false,
        //   data: this.uniqDates.map(
        //     (date) => appsConfigsMap[app].tradar.data[date]
        //   ),
        //   backgroundColor: appsConfigsMap[app].color,
        //   borderColor: appsConfigsMap[app].color,
        //   spanGaps: true,
        //   borderWidth: 3,
        //   lineTension: 0,
        //   radius: 6,
        //   pointHoverRadius: 10,
        // }));
      },

      options: {
        title: {
          display: true,
          text: 'Release frequency, count/year',
        },
        scales: {
          // yAxes: [{ type: 'category', ticks: { reverse: true } }],
        },
      },
    });
  },
});
</script>
