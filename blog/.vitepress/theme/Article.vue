<template>
  <article class="container pt-10 root">
    <a href="/blog/" title="Home" class="text-2xl">← all posts</a>

    <main class="mt-10 myprose">
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
.root >>> h2 {
  border: none;
}
.root >>> img {
  border: 1px solid #d1d5db;
  border-radius: 5px;
  margin: 0 auto;
}
</style>
