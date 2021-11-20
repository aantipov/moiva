<template>
  <div class="container flex items-center sm:pt-4">
    <img
      src="./moiva-head.jpg"
      alt="Moiva.io logo"
      width="100"
      height="100"
      style="margin: 0 20px 0 0"
    />
    <a :href="url" title="Home" class="sm:text-5xl text-4xl"> Moiva.io Blog </a>
  </div>
</template>

<script setup lang="ts">
import { withBase } from 'vitepress';
const url = withBase('/');
</script>

<style scoped>
a {
  text-decoration: none;
  font-weight: 400;
}
</style>
