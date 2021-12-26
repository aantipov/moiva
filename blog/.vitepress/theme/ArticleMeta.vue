<template>
  <div class="opacity-70 flex items-center h-full">
    {{ post.date.string }}
    <span class="mx-3"> / </span>
    {{ post.readTime }}
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vitepress';
import { data as posts } from '../posts.data';
const { path } = useRoute();
const post = posts.find(({ href }) => path.includes(href)) as {
  readTime: string;
  date: { string: string };
};
</script>
