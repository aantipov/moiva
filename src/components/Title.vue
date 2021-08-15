<template>
  <div v-if="data">
    <h1 class="mb-1">{{ data.title }}</h1>
    <div v-if="data.desc" class="text-lg opacity-80">{{ data.desc }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { librariesRR, categoryRef } from '@/store/libraries';

const data = computed<{ title: string; desc: string | null } | null>(() => {
  if (!librariesRR.length) {
    return null;
  }
  if (librariesRR.length === 1) {
    return {
      title: librariesRR[0].alias,
      desc: librariesRR[0].repo.description,
    };
  }
  if (librariesRR.length <= 3) {
    return {
      title: librariesRR.map((lib) => lib.alias).join(' vs '),
      desc: categoryRef.value,
    };
  }
  if (categoryRef.value) {
    return { title: categoryRef.value, desc: null };
  }
  return {
    title: 'Compare selected libraries',
    desc: null,
  };
});
</script>
