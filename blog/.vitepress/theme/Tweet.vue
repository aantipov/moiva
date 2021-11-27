<template>
  <div class="flex justify-center">
    <blockquote class="twitter-tweet">
      <a :href="'https://twitter.com/' + id">Loading a tweet...</a>
    </blockquote>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  id: String,
});
</script>
