<template>
  <div>
    <h3 class="h3">NPM downloads</h3>

    <div v-if="isLoading" class="p text-center">Loading...</div>

    <div v-else class="chart">
      <canvas id="npmDownloads" width="1200" height="600"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from 'axios';
import Chart from 'chart.js';

export default Vue.extend({
  name: 'Npm',
  data() {
    return {
      isLoading: true,
      downloads: [],
    };
  },
  mounted() {
    axios
      .get('/api/npm')
      .then((res) => res.data)
      .then((res): any => {
        this.isLoading = false;
        this.downloads = res;
      });
  },
  updated() {
    const ctx = document.getElementById('npmDownloads') as HTMLCanvasElement;

    if (this.isLoading) {
      return;
    }

    const categories = this.downloads.map(({ month }) => month);
    const vueData = this.downloads.map(({ vue }) => vue);
    const reactData = this.downloads.map(({ react }) => react);

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: categories,
        datasets: [
          {
            label: 'Vue',
            data: vueData,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
          {
            label: 'React',
            data: reactData,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
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
  width: 1200px;
  height: 600px;
  margin: 20px auto;
}
</style>
