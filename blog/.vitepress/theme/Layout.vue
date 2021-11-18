<template>
  <div class="antialiased myprose">
    <!-- <Header /> -->
    <Blog v-if="isIndex" />
    <Article v-else />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vitepress';
import Blog from './Blog.vue';
import Article from './Article.vue';

const route = useRoute();
const isIndex = computed(() => {
  return route.path.replace(/index.html$/, '') === '/blog/';
});
</script>
