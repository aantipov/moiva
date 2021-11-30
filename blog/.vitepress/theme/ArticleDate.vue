<template>
  <div>{{ date }}</div>
</template>

<script setup lang="ts">
import { useData } from 'vitepress';
const { frontmatter: data } = useData();
const date = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  day: 'numeric',
}).format(new Date(data.value.date));
</script>
