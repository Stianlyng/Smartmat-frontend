<script setup>
import '@/assets/css/home/welcome.css'

// Function to scroll down to the next section
const scrollDown = () => {
  const welcome = document.querySelector('.welcome')
  const infoSection = document.querySelector('.info-section')
  welcome.scrollIntoView({ behavior: 'smooth' })
  infoSection.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="welcome">
    <img src="@/assets/img/SmartMat_logo_transparent.png" alt="SmartMat" class="logo" />
    <h1>Vær med å gjør en forskjell for miljøet og få en bedre hverdag!</h1>
    <router-link to="/login" class="button"> Klikk her for å komme i gang </router-link>
    <div class="scroll-indicator">
      <img
        src="@/assets/img/down-indicator.png"
        alt="Scroll down"
        oncontextmenu="return false;"
        @click="scrollDown"
      />
    </div>
  </div>
</template>
