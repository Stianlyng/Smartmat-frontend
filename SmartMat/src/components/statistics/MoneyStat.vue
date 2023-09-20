<script setup>
import '@/assets/css/statistics/money-stat.css'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faFaceSmile, faFaceAngry, faFaceMeh } from '@fortawesome/free-solid-svg-icons'
import InfoButton from '../InfoButton.vue'

const goodThreshold = 150
const badThreshold = 400

//Defines the props for the component which is info about the user money lost
const props = defineProps({
  value: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <div class="money-stat">
    <div class="money-stat-header">
      <h2>Penger tapt på matsvinn:</h2>
      <InfoButton
        message="Dette er hvor mye penger du har tapt på matsvinn i løpet av den siste måneden. Dette er basert på hvor mye du har kastet, og hvor mye du har betalt for maten."
      />
    </div>
    <div class="money-stat-content">
      <p>-{{ props.value.toFixed(2) }}kr</p>
      <font-awesome-icon :icon="faFaceSmile" v-if="props.value < goodThreshold" class="good" />
      <font-awesome-icon :icon="faFaceMeh" v-else-if="props.value < badThreshold" class="ok" />
      <font-awesome-icon :icon="faFaceAngry" v-else class="bad" />
    </div>
  </div>
</template>
