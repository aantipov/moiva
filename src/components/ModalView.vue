<template>
  <transition name="modal">
    <div v-show="showModal" class="modal-mask" @click="$emit('close')">
      <div class="modal-wrapper">
        <div class="modal-container overflow-hidden rounded-md" @click.stop>
          <!--  Header  -->
          <div class="flex justify-end border bg-gray-100">
            <button
              class="background-transparent my-2 mr-1 px-4 py-2 text-sm font-bold uppercase text-gray-500 outline-none focus:outline-none"
              type="button"
              style="transition: all 0.15s ease"
              @click="$emit('close')"
            >
              Close
            </button>
          </div>

          <!--  Body  -->
          <div class="modal-body p-4">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { watch } from 'vue';

const props = defineProps<{
  showModal: boolean;
}>();

defineEmits(['close']);

watch(
  () => props.showModal,
  () => {
    if (props.showModal) {
      document.body.classList.add('showing-modal');
    } else {
      document.body.classList.remove('showing-modal');
    }
  },
);
</script>

<style lang="scss">
/* Placed on the body while a modal is open to prevent scrolling. */
.showing-modal {
  overflow: hidden;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 90%;
  max-width: 450px;
  min-width: 280px;
  margin: 0 auto;
  padding: 0;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-body {
  max-height: 500px;
  overflow-y: scroll;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
