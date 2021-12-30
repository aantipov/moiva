<template>
  <div
    class="p-1 cursor-pointer rounded-md text-gray-600 hover:text-black hover:shadow-md active:shadow-none hover:bg-black/20 active:bg-black/40"
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
