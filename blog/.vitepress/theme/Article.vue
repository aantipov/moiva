<template>
  <article class="container root">
    <main>
      <div class="flex opacity-60 mb-2">
        <ArticleDate class="mr-4" />

        <span>{{ readTime }}</span>
      </div>

      <h1>{{ data.title }}</h1>

      <Content class="mt-6" />

      <ArticleFooter />
    </main>
  </article>
</template>

<script setup lang="ts">
import ArticleDate from './ArticleDate.vue';
import ArticleFooter from './ArticleFooter.vue';
import { useData } from 'vitepress';
import { useReadTime } from './useReadTime';
const { frontmatter: data } = useData();
const readTime = useReadTime();
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
