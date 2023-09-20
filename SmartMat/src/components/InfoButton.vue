<script setup>
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faInfoCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import '@/assets/css/info-button.css'

//Defines the props for the component which is the message to be displayed
const props = defineProps({
  message: {
    type: String,
    required: true
  }
})

const show = ref(false)
</script>

<template>
  <font-awesome-icon :icon="faInfoCircle" @click="show = !show" class="info-button" />
  <div class="info-popup" v-if="show" @click="show = false">
    <div class="info-popup-content">
      <font-awesome-icon :icon="faTimesCircle" class="info-popup-close" />
      <div class="info-popup-message">
        <p>{{ message }}</p>
      </div>
    </div>
  </div>
</template>
