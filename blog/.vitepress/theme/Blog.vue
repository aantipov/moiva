<template>
  <section>
    <BlogItem
      v-for="article in articles"
      :title="article.title"
      :link="article.link"
    >
      {{ article.descr }}
    </BlogItem>
  </section>
</template>

<script setup lang="ts">
import { withBase } from 'vitepress';
const url = withBase('/');
const articles = [
  {
    title: 'October 2021 update',
    link: withBase('/2021-10-update/'),
    descr:
      'Cumulative Stars chart, colorized charts sections, fixed back-forward',
  },
];
</script>
