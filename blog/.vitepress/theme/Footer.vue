<template>
  <footer class="flex justify-center mt-8 py-8">
    <p>
      © 2009-{{ year }}
      <a href="/"> Alexey Antipov </a>
    </p>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear();
</script>
