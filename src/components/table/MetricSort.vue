<template>
  <div
    class="cursor-pointer rounded-md p-1 text-gray-600 hover:bg-black/20 hover:text-black hover:shadow-md active:bg-black/40 active:shadow-none"
    @click="sortFn"
  >
    <m-sort-icon />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { sortLibraries } from '@/store/libraries';
import { LibraryT } from '@/getLibrary';

const props = defineProps<{
  sortFn: (_a: LibraryT, _b: LibraryT) => number; // Sort from Best to Worst
}>();

const sortReverseRef = ref(false);

function sortFn() {
  sortLibraries(props.sortFn, sortReverseRef.value);
  sortReverseRef.value = !sortReverseRef.value;
}
</script>

<style lang="postcss"></style>
