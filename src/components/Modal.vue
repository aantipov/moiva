<template>
  <transition name="modal">
    <div v-show="showModal" class="modal-mask">
      <div class="modal-wrapper">
        <div class="relative rounded-md modal-container">
          <button
            class="absolute right-0 px-3 py-1 my-1 mr-1 text-xs font-bold text-gray-500 uppercase outline-none background-transparent focus:outline-none"
            type="button"
            style="transition: all 0.15s ease"
            @click="$emit('close')"
          >
            Close
          </button>

          <div class="px-4 modal-body">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'Modal',
  props: {
    showModal: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {};
  },
  watch: {
    showModal(): void {
      if (this.showModal) {
        document.body.classList.add('showing-modal');
      } else {
        document.body.classList.remove('showing-modal');
      }
    },
  },
});
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
  width: 80%;
  max-width: 400px;
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
