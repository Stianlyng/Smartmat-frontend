<script setup>
import '@/assets/css/setup/setup.css'
import SetupWelcome from '../components/setup/SetupWelcome.vue'
import SetupAllergies from '../components/setup/SetupAllergies.vue'
import SetupPreferences from '../components/setup/SetupPreferences.vue'
import SetupGroup from '../components/setup/SetupGroup.vue'
import SetupComplete from '../components/setup/SetupComplete.vue'
import { ref } from 'vue'

const setupStep = ref(0)

function nextStep() {
  setupStep.value++
}
</script>

<template>
  <main class="setup">
    <SetupWelcome v-if="setupStep === 0" @nextStep="nextStep" />
    <SetupAllergies v-if="setupStep === 1" @nextStep="nextStep" />
    <SetupPreferences v-if="setupStep === 2" @nextStep="nextStep" />
    <SetupGroup v-if="setupStep === 3" @nextStep="nextStep" />
    <SetupComplete v-if="setupStep === 4" />
  </main>
</template>
