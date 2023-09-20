<script setup>
const emit = defineEmits(['nextStep'])

//Emits nextStep
function nextStep() {
  emit('nextStep')
}
</script>

<template>
  <h1>Velkommen til SmartMat!</h1>
  <p>
    Vi skal hjelpe deg med å sette opp din profil. <br />Dette gjør vi for å kunne gi deg en best
    mulig opplevelse med SmartMat.
  </p>
  <button @click="nextStep">Neste</button>
</template>
