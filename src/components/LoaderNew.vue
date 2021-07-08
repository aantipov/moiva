<template>
  <div
    class="
      absolute
      flex
      items-center
      justify-center
      w-full
      h-full
      bg-white bg-opacity-40
    "
  >
    <div class="root"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'LoaderNew',
});
</script>

<style lang="postcss" scoped>
.root {
  --c: linear-gradient(#ac4142 0 0);
  background: var(--c), var(--c), var(--c), var(--c), var(--c), var(--c),
    var(--c), var(--c), var(--c);
  background-size: 16px 16px;
  background-repeat: no-repeat;
  animation: sh2-1 1s infinite, sh2-2 1s infinite;
}

@keyframes sh2-1 {
  0%,
  100% {
    width: 45px;
    height: 45px;
  }
  35%,
  65% {
    width: 65px;
    height: 65px;
  }
}

@keyframes sh2-2 {
  0%,
  40% {
    background-position: 0 0, 0 50%, 0 100%, 50% 100%, 100% 100%, 100% 50%,
      100% 0, 50% 0, 50% 50%;
  }
  60%,
  100% {
    background-position: 0 50%, 0 100%, 50% 100%, 100% 100%, 100% 50%, 100% 0,
      50% 0, 0 0, 50% 50%;
  }
}
</style>
