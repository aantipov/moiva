<template>
  <div class="w-full mx-auto lg:w-9/12 xl:w-2/4">
    <!-- Catalog Header -->
    <div class="flex items-center justify-start">
      <img
        src="/images/moiva-head.png"
        alt="Moiva.io logo"
        width="100"
        height="100"
        class="mr-4"
      />
      <h1 class="w-auto m-0 text-5xl">
        <a href="/" title="Home">Moiva.io</a>
      </h1>
    </div>

    <article class="prose prose-lg mt-5 mb-20">
      <h1 class="text-left">About</h1>
      <p>Hi 👋</p>

      <p>
        My name is Alexey, I’m a software developer, mainly focusing on frontend
        web development.
      </p>

      <p>
        There are many software libraries out there and choosing the “right” one
        was always a challenge for me. Searching the Internet, gathering the
        necessary information and comparing libraries was a tedious and
        time-consuming task.
      </p>

      <p>
        That is why I decided to build Moiva: to collect data for all key
        metrics in one place and present them in a meaningful way to make
        library evaluation and comparison as simple as possible. As an added
        bonus, Moiva provides alternatives to consider.
      </p>

      <p>
        Moiva’s current objective is to cover Npm packages ecosystem. The
        long-term plan is to cover other languages such as Php, Go, and Java.
      </p>

      <p>
        If you like the project, consider sharing it and spreading the word
        about it.
      </p>
    </article>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AboutApp',
  setup() {
    return {};
  },
});
</script>
