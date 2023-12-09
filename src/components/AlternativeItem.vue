<template>
  <div
    class="flex items-center rounded border border-gray-200 px-2 py-1 text-sm hover:bg-gray-100"
    :class="{
      'cursor-not-allowed bg-gray-100': isLoading || isTemporarilyDisabled,
      'cursor-pointer': !isLoading,
    }"
    @click="onClick"
  >
    <span class="text-gray-800">{{ name }}</span>
    <!-- <span class="ml-auto rounded bg-green-100 px-2 py-1 text-xs text-green-800"
      >0.8</span
    > -->
    <span v-show="isSelected" class="ml-2 text-lg font-semibold text-red-500"
      >-</span
    >
    <span v-show="!isSelected" class="ml-2 text-lg font-semibold text-green-500"
      >+</span
    >
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from '@nanostores/vue';
import {
  $trimmedLibraries,
  $loadingLibraries,
} from '@/nanostore/trimmedLibraries';
import { $addedNpmPackage, $removedLibrary } from '@/nanostore/crudLibrary';

const trimmedLibraries = useStore($trimmedLibraries);
const loadingLibraries = useStore($loadingLibraries);

const props = defineProps<{
  name: string;
}>();

const isSelected = computed<boolean>(() =>
  trimmedLibraries.value.some((lib) => lib.npm.name === props.name),
);

const isLoading = computed<boolean>(
  () => !!loadingLibraries.value.includes(props.name),
);

const isTemporarilyDisabled = ref(false);

function onClick() {
  if (isTemporarilyDisabled.value || isLoading.value) return;

  isTemporarilyDisabled.value = true;
  setTimeout(() => {
    isTemporarilyDisabled.value = false;
  }, 1000);
  // TODO: disable the button for two seconds after click
  if (isSelected.value) {
    $removedLibrary.set(props.name);
  } else {
    $addedNpmPackage.set(props.name);
  }
}
</script>

<style lang="postcss" scoped></style>
