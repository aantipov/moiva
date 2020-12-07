<template>
  <div>
    <div
      class="flex items-center justify-between w-full h-12 px-3 mt-2 mb-4 text-gray-600 border border-gray-400 cursor-pointer rounded-md select-field"
      @click="showModal = true"
    >
      Add libraries to comparison...
      <ArrowDown />
    </div>

    <div>
      <Chip v-for="lib in value" :key="lib" selected @toggle="deselect(lib)">{{
        lib
      }}</Chip>
    </div>

    <Modal class="modal" :show-modal="showModal" @close="showModal = false">
      <div class="mt-4">
        <div class="mb-2 text-gray-600 uppercase"># Frameworks</div>
        <div>
          <Chip
            v-for="libName in frameworks"
            :key="libName"
            :selected="isAppSelected(libName)"
            @toggle="toggle(libName)"
            >{{ libName }}</Chip
          >
        </div>
      </div>

      <div class="mt-4">
        <div class="mb-2 text-gray-600 uppercase"># State Management</div>
        <div>
          <Chip
            v-for="libName in stateManageLibs"
            :key="libName"
            :selected="isAppSelected(libName)"
            @toggle="toggle(libName)"
            >{{ libName }}</Chip
          >
        </div>
      </div>

      <div class="mt-4 mb-4">
        <div class="mb-2 text-gray-600 uppercase"># Testing</div>
        <div>
          <Chip
            v-for="libName in testingLibs"
            :key="libName"
            :selected="isAppSelected(libName)"
            @toggle="toggle(libName)"
            >{{ libName }}</Chip
          >
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Modal from './Modal.vue';
import Chip from './Chip.vue';
import ArrowDown from './icons/ArrowDown.vue';
import configApps from '../../apps-config';

export default Vue.extend({
  components: {
    Modal,
    Chip,
    ArrowDown,
  },

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
    frameworks(): string[] {
      return configApps
        .filter((lib) => lib.category === 'Framework')
        .map((lib) => lib.name);
    },
    stateManageLibs(): string[] {
      return configApps
        .filter((lib) => lib.category === 'StateManagement')
        .map((lib) => lib.name);
    },
    testingLibs(): string[] {
      return configApps
        .filter((lib) => lib.category === 'Testing')
        .map((lib) => lib.name);
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
.select-field {
  /* @apply border-solid border-gray-100; */
}
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
