<template>
  <div class="root">
    <svg
      id="npm"
      class="icon"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 780 250"
      style="enable-background: new 0 0 780 250"
      xml:space="preserve"
    >
      <path
        class="icon-path"
        d="M240,250h100v-50h100V0H240V250z M340,50h50v100h-50V50z M480,0v200h100V50h50v150h50V50h50v150h50V0H480z
	 M0,200h100V50h50v150h50V0H0V200z"
      />
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'NpmIcon',
});
</script>

<style lang="postcss" scoped>
/* .root { */
/*   height: 24px; */
/*   padding-top: 6px; */
/* } */
/* .icon { */
/*   width: 48px; */
/*   height: 15px; */
/* } */
.icon-path {
  @apply fill-current text-gray-400;
}
.root:hover .icon-path {
  fill: #231f20;
}
</style>
