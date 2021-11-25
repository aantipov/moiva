<template>
  <article class="container pt-10 sm:pt-20 root">
    <main>
      <ArticleDate />

      <h1 class="header">{{ data.title }}</h1>

      <Content class="mt-6" />

      <ArticleFooter />
    </main>
  </article>
</template>

<script setup lang="ts">
import ArticleDate from './ArticleDate.vue';
import ArticleFooter from './ArticleFooter.vue';
import { useData } from 'vitepress';
const { frontmatter: data } = useData();
</script>

<style scoped>
.root {
  max-width: 100vw;
}
.root :deep(img) {
  border: 1px solid #d1d5db;
  border-radius: 5px;
  margin: 0 auto;
}
</style>
