<template>
  <Suggestions @select="select" />
</template>

<script setup lang="ts">
import Suggestions from './Suggestions.vue';
import {
  $addedSearchNpmPackage,
  $addedSearchRepo,
} from '@/nanostore/addedSearchValue.js';

function select(id: string, isNpm: boolean) {
  if (isNpm) {
    $addedSearchNpmPackage.set(id);
  } else {
    $addedSearchRepo.set(id);
  }
}
</script>
