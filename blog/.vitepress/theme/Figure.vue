<template>
  <figure>
    <img :src="link" :alt="caption" />
    <figcaption>
      <p>{{ caption }}</p>
    </figcaption>
  </figure>
</template>

<script setup>
const props = defineProps({
  link: String,
  caption: String,
});
</script>

<style scoped>
img {
  border-radius: 5px;
  margin-bottom: 1rem;
}
figcaption {
  text-align: center;
  color: gray;
  font-size: 80%;
  margin-bottom: 16 px;
}
</style>
