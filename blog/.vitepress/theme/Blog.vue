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
import { data as posts } from '../posts.data';

const articles = posts.map(({ title, href, summary }) => ({
  title,
  link: withBase(href),
  descr: summary,
}));
</script>

<style scoped>
h2 {
  @apply border-0 my-0 sm:mb-1 text-2xl;
}
p {
  @apply my-0;
}
article {
  @apply mb-14;
}
article:hover h2,
article:hover p {
  @apply text-primary;
}
.link {
  color: inherit;
  text-decoration: none;
  @apply font-normal;
}
</style>
