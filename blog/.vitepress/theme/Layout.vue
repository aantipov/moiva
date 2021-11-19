<template>
  <div class="antialiased h-full flex flex-col">
    <div class="myprose flex-grow">
      <Header />
      <Article />
    </div>

    <Footer class="flex-shrink-0" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Article from './Article.vue';
</script>
