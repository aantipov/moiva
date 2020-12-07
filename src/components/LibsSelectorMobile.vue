<template>
  <div>
    <!--  Input    -->
    <div
      class="flex items-center justify-between w-full h-12 px-3 mt-2 mb-2 text-gray-600 border border-gray-400 cursor-pointer rounded-md"
      @click="showModal = true"
    >
      Add libraries to comparison...
      <jd-arrow-down />
    </div>

    <!--  Selected libs  -->
    <div>
      <jd-chip
        v-for="lib in value"
        :key="lib"
        selected
        @toggle="deselect(lib)"
        >{{ lib }}</jd-chip
      >
    </div>

    <!--  Modal  -->
    <Modal class="modal" :show-modal="showModal" @close="showModal = false">
      <div v-for="cat in catsWithLibs" :key="cat.categoryName" class="mb-4">
        <div class="mb-2 text-gray-600 uppercase">{{ cat.categoryName }}</div>
        <div>
          <jd-chip
            v-for="libName in cat.libs"
            :key="libName"
            :selected="isAppSelected(libName)"
            @toggle="toggle(libName)"
            >{{ libName }}</jd-chip
          >
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Modal from './Modal.vue';
import configApps, { categoryMap } from '../../apps-config';

export default Vue.extend({
  components: { Modal },

  props: {
    value: {
      type: Array,
      required: true,
    },
    libs: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      showModal: false,
    };
  },

  computed: {
    catsWithLibs(): { categoryName: string; libs: string[] }[] {
      return Object.entries(categoryMap).map(([category, categoryName]) => ({
        categoryName,
        libs: configApps
          .filter((lib) => lib.category === category)
          .map((lib) => lib.name),
      }));
    },
  },

  methods: {
    isAppSelected(app: string): boolean {
      return this.value.indexOf(app) > -1;
    },
    toggle(libName: string): void {
      if (this.isAppSelected(libName)) {
        this.deselect(libName);
      } else {
        this.select(libName);
      }
    },
    deselect(libname: string): void {
      const newSelectedApps = this.value.filter((lib) => lib !== libname);
      this.$emit('input', newSelectedApps);
    },
    select(libname: string): void {
      const newSelectedApps = [...this.value, libname];
      this.$emit('input', newSelectedApps);
    },
  },
});
</script>

<style lang="postcss" scoped>
.option {
  @apply h-12 p-0 px-5 flex items-center text-gray-800 cursor-pointer;
}
.option--category {
  @apply uppercase text-gray-800 cursor-default;
}
.option--selected {
  @apply font-bold text-gray-800;
}
.option:hover {
  @apply text-black bg-gray-200;
}
.option.option--category:hover {
  @apply bg-white text-gray-800;
}
</style>
