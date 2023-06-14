<template>
  <Search class="w-full" :placeholder="placeholder" @select="select" />
</template>

<script setup lang="ts">
import Search from './Search.vue';
import { constructHref } from '@/utils';
import { $addedNpmPackage, $addedRepo } from '@/nanostore/crudLibrary.js';
const props = defineProps<{
  isHomePage: boolean;
}>();

const placeholder = props.isHomePage
  ? 'Search for an npm package'
  : 'Add an npm package to comparison';

function select(id: string, isNpm: boolean) {
  if (isNpm) {
    props.isHomePage && window.location.assign(constructHref([id], []));
    !props.isHomePage && $addedNpmPackage.set(id);
  } else {
    props.isHomePage && window.location.assign(constructHref([], [id]));
    !props.isHomePage && $addedRepo.set(id);
  }
}
</script>
