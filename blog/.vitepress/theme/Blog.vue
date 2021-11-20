<template>
  <section class="container">
    <article v-for="article in articles">
      <h2>
        <a :href="article.link">{{ article.title }}</a>
      </h2>

      <p>{{ article.descr }}</p>

      <a class="readmore" aria-label="read more" :href="article.link"
        >Read more →</a
      >
    </article>
  </section>
</template>

<script setup lang="ts">
import { withBase } from 'vitepress';
const articles = [
  {
    title: 'October 2021 update',
    link: withBase('/2021-10-update/'),
    descr:
      'Cumulative Stars chart, colorized charts sections, fixed back-forward',
  },
];
</script>

<style scoped>
h2 {
  @apply border-0 mb-2;
}
h2 a {
  color: inherit;
  text-decoration: none;
}
.readmore {
  @apply mt-1;
}
p {
  @apply mb-2;
}
</style>
