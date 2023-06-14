<template>
  <Search class="w-full" :placeholder="placeholder" @select="select" />
</template>

<script setup lang="ts">
import Search from './Search.vue';
import { constructHref } from '@/utils';
import { $addedNpmPackage, $addedRepo } from '@/nanostore/crudLibrary.js';
const props = defineProps<{
  isMainAppPage: boolean;
}>();

const placeholder = props.isMainAppPage
  ? 'Add an npm package to comparison'
  : 'Search for an npm package';

function select(id: string, isNpm: boolean) {
  if (isNpm) {
    props.isMainAppPage && $addedNpmPackage.set(id);
    !props.isMainAppPage && window.location.assign(constructHref([id], []));
  } else {
    props.isMainAppPage && $addedRepo.set(id);
    !props.isMainAppPage && window.location.assign(constructHref([], [id]));
  }
}
</script>
