<template>
  <Search class="w-full" @select="select" />
</template>

<script setup lang="ts">
import Search from './Search.vue';
import { constructHref } from '@/utils';
import {
  $addedSearchNpmPackage,
  $addedSearchRepo,
} from '@/nanostore/addedSearchValue.js';
const props = defineProps<{
  isHomePage: boolean;
}>();

function select(id: string, isNpm: boolean) {
  if (isNpm) {
    props.isHomePage && window.location.assign(constructHref([id], []));
    !props.isHomePage && $addedSearchNpmPackage.set(id);
  } else {
    props.isHomePage && window.location.assign(constructHref([], [id]));
    !props.isHomePage && $addedSearchRepo.set(id);
  }
}
</script>
