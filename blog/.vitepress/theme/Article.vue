<template>
  <article class="container root">
    <main>
      <ClientOnly>
        <ArticleMeta />
      </ClientOnly>

      <h1>{{ data.title }}</h1>

      <Content class="mt-6" />

      <ArticleFooter />
    </main>
  </article>
</template>

<script setup lang="ts">
import ArticleFooter from './ArticleFooter.vue';
import ArticleMeta from './ArticleMeta.vue';
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
