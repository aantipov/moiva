<template>
  <article>
    <h2>
      <a :href="link">{{ title }}</a>
    </h2>

    <p><slot></slot></p>

    <a class="readmore" aria-label="read more" :href="link">Read more →</a>
  </article>
</template>

<script setup>
const props = defineProps({
  title: String,
  link: String,
});
</script>

<style scoped>
h2 {
  @apply border-0 mb-2;
}
h2 a {
  color: inherit;
  text-decoration: none;
}
.readmore {
  @apply mt-1;
}
p {
  @apply mb-2;
}
</style>
