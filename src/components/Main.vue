<template>
  <div>
    <h1>Vue vs React</h1>
    <div style="width: 400px; height: 400px">
      <canvas id="myChart" width="400" height="400"></canvas>
    </div>
    <div v-if="$apollo.loading">Loading...</div>
    <div v-else>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import gql from 'graphql-tag';
import Chart from 'chart.js';

export default Vue.extend({
  name: 'MainCo',
  apollo: {
    repos: {
      update: data => data,
      query: gql`
        query {
          vue: repository(name: "vue", owner: "vuejs") {
            description
            allIssues: issues {
              totalCount
            }
            openIssues: issues(filterBy: {states: [OPEN]}) {
              totalCount
            }
            closedIssues: issues(filterBy: {states: [CLOSED]}) {
              totalCount
            }
          }
          react: repository(name: "react", owner: "facebook") {
            description
            allIssues: issues {
              totalCount
            }
            openIssues: issues(filterBy: {states: [OPEN]}) {
              totalCount
            }
            closedIssues: issues(filterBy: {states: [CLOSED]}) {
              totalCount
            }
          }
        }
      `,
    }  
  },
  updated() {
    var ctx = document.getElementById('myChart');
    if (this.$apollo.loading) {
     return; 
    }
    console.log('updatee')
    const {vue, react} = this.repos;
    new Chart(ctx, {
      type: 'bar',
      data: {
          labels: ['Vue', 'React'],
          datasets: [
          {
              label: '# of open issues',
              data: [vue.openIssues.totalCount, react.openIssues.totalCount],
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
          },
          {
              label: '# of closed issues',
              data: [vue.closedIssues.totalCount, react.closedIssues.totalCount],
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
          },
        ]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
    });
  }
});
</script>

<style scoped lang="scss">
</style>
