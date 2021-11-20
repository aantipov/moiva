<template>
  <div class="antialiased h-full flex flex-col">
    <div class="myprose flex-grow">
      <Header />
      <Blog v-if="isIndex" />
      <Article v-else />
    </div>

    <Footer class="flex-shrink-0" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vitepress';
import Header from './Header/Header.vue';
import Blog from './Blog.vue';
import Article from './Article.vue';
import Footer from './Footer.vue';

const route = useRoute();
const isIndex = computed(() => {
  const strippedPath = route.path.replace(/index.html$/, '');
  return strippedPath === '/' || strippedPath === '/blog/';
});
</script>
