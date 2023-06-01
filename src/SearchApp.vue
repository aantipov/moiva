<template>
  <Search class="mx-auto w-full lg:w-9/12 xl:w-2/4" @select="select" />
</template>

<script setup lang="ts">
import Search from '@/components/search/Search.vue';
import { constructHref } from '@/utils';

function select(id: string, isNpm: boolean) {
  if (isNpm) {
    window.location.assign(constructHref([id], []));
  } else {
    window.location.assign(constructHref([], [id]));
  }
}
</script>
