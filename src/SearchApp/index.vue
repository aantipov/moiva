<template>
  <Search class="mx-auto w-full lg:w-9/12 xl:w-2/4" @select="select" />
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
