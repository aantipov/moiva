<template>
  <div>
    <h3 class="h3">ThoughtWorks Technology Radar</h3>

    <div class="chart">
      <canvas id="techRadar" width="800" height="400" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Chart from 'chart.js';
const HOLD = 'Hold';
const ADOPT = 'Adopt';
const TRIAL = 'Trial';
const ASSESS = 'Assess';
const NO_DATA = 'No Data';

const react = {
  '2015-01': ASSESS,
  '2015-05': TRIAL,
  '2015-11': TRIAL,
  '2016-04': ADOPT,
  '2016-11': ADOPT,
};
const vue = {
  '2016-11': ASSESS,
  '2017-03': TRIAL,
  '2020-05': ADOPT,
};

const dates = [...Object.keys(react), ...Object.keys(vue)];
const uniqDates = [...new Set(dates)].sort();

export default Vue.extend({
  name: 'TechRadar',
  data() {
    return {};
  },
  mounted() {
    const ctx = document.getElementById('techRadar') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'line',

      data: {
        // labels: uniqDates,
        // @ts-ignore
        xLabels: uniqDates,
        yLabels: [NO_DATA, ASSESS, TRIAL, ADOPT, HOLD],
        datasets: [
          {
            label: 'Vue',
            fill: false,
            // @ts-ignore
            data: uniqDates.map((date) => vue[date]),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            spanGaps: true,
            borderWidth: 1,
            lineTension: 0,
            pointStyle: 'triangle',
            radius: 8,
          },
          {
            label: 'React',
            fill: false,
            // @ts-ignore
            data: uniqDates.map((date) => react[date]),
            spanGaps: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            lineTension: 0,
            radius: 8,
          },
        ],
      },

      options: {
        tooltips: {
          enabled: true,
        },
        scales: {
          yAxes: [
            {
              type: 'category',
              ticks: {
                reverse: true,
              },
            },
          ],
        },
      },
    });
  },
});
</script>

<style scoped lang="scss">
.chart-list {
  display: flex;
  flex-wrap: wrap;
}
.chart {
  width: 800px;
  height: 400px;
  margin: 20px auto;
}
</style>
