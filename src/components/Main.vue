<template>
  <div>
    <div v-if="$apollo.loading">Loading...</div>
    <div v-else>
      <div>
        Vue: {{ repos.vue.description }} 
      </div>
      <div>
        React: {{ repos.react.description }}
      </div> 
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import gql from 'graphql-tag';

export default Vue.extend({
  name: 'Main',
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
  }
});
</script>

<style scoped lang="scss">
</style>
