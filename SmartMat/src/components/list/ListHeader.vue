<script setup>
import '@/assets/css/list/list-header.css'
import { ref } from 'vue'

const emit = defineEmits(['setActive'])
const activeButton = ref(0)

//Switch between components
const switchButton = (index) => {
  activeButton.value = index
  emit('setActive', index)
}
</script>

<template>
  <div class="list-header">
    <div class="switch">
      <button
        class="switch-button"
        :class="{ active: activeButton === 0 }"
        @click="switchButton(0)"
      >
        Kjøleskap
      </button>
      <button
        class="switch-button"
        :class="{ active: activeButton === 1 }"
        @click="switchButton(1)"
      >
        Handleliste
      </button>
    </div>
  </div>
</template>
