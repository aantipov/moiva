<template>
  <div>
    <button @click="showModal = true">Hello</button>

    <Modal class="modal" :show-modal="showModal">
      <template v-slot:header>
        <div class="flex items-center justify-between h-12 px-5">
          Select libs
          <button @click="showModal = false">Close Modal</button>
        </div>
      </template>

      <div v-for="lib in libs" :key="lib.name">
        <div
          class="option"
          :class="{
            'option--category': lib.isCategory,
            'option--selected': isAppSelected(lib.name),
          }"
          @click="toggle(lib.name)"
        >
          <div v-if="!lib.isCategory" class="w-8">
            <Checkmark v-if="isAppSelected(lib.name)" />
          </div>
          {{ lib.name }}
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Checkmark from './Checkmark.vue';
import Modal from './Modal.vue';

export default Vue.extend({
  components: {
    Checkmark,
    Modal,
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
  methods: {
    // filterOption(option: OptionT, label = '', search: string): boolean {
    //   if ('isCategory' in option) {
    //     return true;
    //   }
    //   return label.toLowerCase().indexOf(search.toLowerCase()) > -1;
    // },
    isAppSelected(app: string): boolean {
      return this.value.indexOf(app) > -1;
    },
    toggle(libName: string): void {
      console.log('toggle', libName);
      let newSelectedApps;
      if (this.isAppSelected(libName)) {
        newSelectedApps = this.value.filter((lib) => lib !== libName);
      } else {
        newSelectedApps = [...this.value, libName];
      }
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
