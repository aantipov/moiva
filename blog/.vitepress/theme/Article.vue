<template>
  <article class="container pt-10 sm:pt-20 root">
    <main class="myprose">
      <h1 class="header">{{ data.title }}</h1>

      <Content class="mt-6" />
    </main>

    <Footer />
  </article>
</template>

<script setup lang="ts">
import { useData } from 'vitepress';
const { frontmatter: data } = useData();
</script>

<style scoped>
.root :deep(h2) {
  border: none;
}
.root :deep(img) {
  border: 1px solid #d1d5db;
  border-radius: 5px;
  margin: 0 auto;
}
</style>
