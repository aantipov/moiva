<template functional>
  <div class="root" @click="listeners.click()">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="text-gray-400 rounded-full cursor-pointer feather feather-x hover:text-gray-800"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  </div>
</template>

<style lang="postcss" scoped>
.root {
  width: 24px;
  height: 24px;
}
</style>
