<template>
  <footer
    class="pt-5 my-0 text-base text-white pb-7 font-extralight bg-primary"
  >
    <div class="container px-10 antialiased sm:px-24 content">
      <div class="w-full mx-auto lg:w-9/12 xl:w-2/4">
        <div class="flex items-center justify-center mb-4">
          <span>Made with</span>
          <span style="margin: 0 4px">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style="width: 20px; height: 20px"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
          <span>by</span>
          <a
            class="primary-link"
            href="https://alexei.me"
            target="_blank"
            style="margin-left: 4px"
            >Alexey Antipov</a
          >
        </div>

        <div class="flex items-center justify-between text-xl">
          <a class="primary-link" href="https://moiva.io">Moiva.io</a>
          <a class="primary-link" href="https://moiva.io/about/">About</a>
          <a class="primary-link" href="https://moiva.io/catalog/">Catalog</a>
          <a class="primary-link" href="/blog/">Blog</a>
        </div>

        <div class="flex flex-wrap items-center justify-around mt-6 text-xl">
          <a
            class="primary-link flex items-center"
            href="https://github.com/aantipov/moiva"
            target="_blank"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 fill-current text-white mr-1"
              style="max-width: 50px; max-height: 50px"
              role="img"
              aria-label="GitHub icon"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              />
            </svg>
            GitHub</a
          >
          <a
            class="primary-link flex items-center"
            href="https://twitter.com/_aantipov"
            target="_blank"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 fill-current text-white mr-1"
              style="max-width: 50px; max-height: 50px"
              role="img"
              aria-label="Twitter icon"
              viewBox="0 0 24 24"
            >
              <g>
                <path
                  d="M23.643 4.937c-.835.37-1.732.62-2.675.733a4.67 4.67 0 0 0 2.048-2.578a9.3 9.3 0 0 1-2.958 1.13a4.66 4.66 0 0 0-7.938 4.25a13.229 13.229 0 0 1-9.602-4.868c-.4.69-.63 1.49-.63 2.342A4.66 4.66 0 0 0 3.96 9.824a4.647 4.647 0 0 1-2.11-.583v.06a4.66 4.66 0 0 0 3.737 4.568a4.692 4.692 0 0 1-2.104.08a4.661 4.661 0 0 0 4.352 3.234a9.348 9.348 0 0 1-5.786 1.995a9.5 9.5 0 0 1-1.112-.065a13.175 13.175 0 0 0 7.14 2.093c8.57 0 13.255-7.098 13.255-13.254c0-.2-.005-.402-.014-.602a9.47 9.47 0 0 0 2.323-2.41l.002-.003z"
                />
              </g>
            </svg>
            Twitter</a
          >
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<style scoped>
.primary-link {
  @apply text-white;
}
</style>
