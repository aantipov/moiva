<template>
  <div>
    <h1>Vue vs React</h1>

    <div v-if="$apollo.loading">Loading...</div>

    <div class="chart">
      <canvas id="issuesCount" width="400" height="400"></canvas>
    </div>
    <div class="chart">
      <canvas id="createdAt" width="400" height="400"></canvas>
    </div>
    <div class="chart">
      <canvas id="starsCount" width="400" height="400"></canvas>
    </div>
    <div class="chart">
      <canvas id="prsCount" width="400" height="400"></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import gql from "graphql-tag";
import Chart from "chart.js";

export default Vue.extend({
  name: "MainCo",
  data() {
    const initData = {
      stars: 0,
      createdAt: "",
      openPRs: { totalCount: 0 },
      closedPRs: { totalCount: 0 },
      mergedPRs: { totalCount: 0 },
      closedIssues: { totalCount: 0 },
      openIssues: { totalCount: 0 },
    };
    return {
      repos: {
        vue: { ...initData },
        react: { ...initData },
      },
    };
  },
  apollo: {
    repos: {
      update: (data) => data,
      query: gql`
        query {
          vue: repository(name: "vue", owner: "vuejs") {
            description
            stars: stargazerCount
            createdAt
            openPRs: pullRequests(states: [OPEN]) {
              totalCount
            }
            mergedPRs: pullRequests(states: [MERGED]) {
              totalCount
            }
            closedPRs: pullRequests(states: [CLOSED]) {
              totalCount
            }
            openIssues: issues(filterBy: { states: [OPEN] }) {
              totalCount
            }
            closedIssues: issues(filterBy: { states: [CLOSED] }) {
              totalCount
            }
          }
          react: repository(name: "react", owner: "facebook") {
            description
            stars: stargazerCount
            createdAt
            openPRs: pullRequests(states: [OPEN]) {
              totalCount
            }
            mergedPRs: pullRequests(states: [MERGED]) {
              totalCount
            }
            closedPRs: pullRequests(states: [CLOSED]) {
              totalCount
            }
            openIssues: issues(filterBy: { states: [OPEN] }) {
              totalCount
            }
            closedIssues: issues(filterBy: { states: [CLOSED] }) {
              totalCount
            }
          }
        }
      `,
    },
  },

  updated() {
    const ctx1 = document.getElementById("issuesCount") as HTMLCanvasElement;
    const ctx2 = document.getElementById("createdAt") as HTMLCanvasElement;
    const ctx3 = document.getElementById("starsCount") as HTMLCanvasElement;
    const ctx4 = document.getElementById("prsCount") as HTMLCanvasElement;

    if (this.$apollo.loading) {
      return;
    }

    const { vue, react } = this.repos;

    new Chart(ctx1, {
      type: "bar",
      data: {
        labels: ["Vue", "React"],
        datasets: [
          {
            label: "# of open issues",
            data: [vue.openIssues.totalCount, react.openIssues.totalCount],
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: "# of closed issues",
            data: [vue.closedIssues.totalCount, react.closedIssues.totalCount],
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });

    new Chart(ctx4, {
      type: "bar",
      data: {
        labels: ["Vue", "React"],
        datasets: [
          {
            label: "# of open PRs",
            data: [vue.openPRs.totalCount, react.openPRs.totalCount],
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: "# of closed PRs",
            data: [vue.closedPRs.totalCount, react.closedPRs.totalCount],
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
          {
            label: "# of merged PRs",
            data: [vue.mergedPRs.totalCount, react.mergedPRs.totalCount],
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });

    function getAge(date: string): number {
      const now = new Date().getTime();
      const then = new Date(date).getTime();

      return Number(((now - then) / (1000 * 3600 * 24 * 365)).toFixed(2));
    }

    new Chart(ctx2, {
      type: "bar",
      data: {
        labels: ["Vue", "React"],
        datasets: [
          {
            label: "Age, years",
            data: [getAge(vue.createdAt), getAge(react.createdAt)],
            backgroundColor: [
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 99, 132, 0.2)",
            ],
            borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });

    new Chart(ctx3, {
      type: "bar",
      data: {
        labels: ["Vue", "React"],
        datasets: [
          {
            label: "Github stars",
            data: [vue.stars, react.stars],
            backgroundColor: [
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 99, 132, 0.2)",
            ],
            borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
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
.chart {
  width: 400px;
  height: 400px;
  float: left;
  margin: 20px;
}
</style>
