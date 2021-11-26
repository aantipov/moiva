<template>
  <section class="container">
    <article v-for="article in articles">
      <a :href="article.link" class="link">
        <h2>
          {{ article.title }}
        </h2>

        <p>{{ article.descr }}</p>
      </a>
    </article>
  </section>
</template>

<script setup lang="ts">
import { withBase } from 'vitepress';
import posts from '../metadata.json';

const articles = posts.map(({ title, href, summary }) => ({
  title,
  link: withBase(href),
  descr: summary,
}));
</script>

<style scoped>
h2 {
  @apply border-0 mb-0 sm:mb-1 text-2xl;
}
.link {
  color: inherit;
  text-decoration: none;
  @apply font-normal;
}
p {
  @apply mb-2;
}
</style>
