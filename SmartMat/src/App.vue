<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navigation from '@/components/navbar/Navbar.vue'
import { useUserStore } from '@/stores/UserStore'

const userStore = useUserStore()
</script>

<template>
  <Navigation v-if="!userStore.loggedIn" />
  <RouterView />
  <div id="error-container"></div>
  <div id="xp-container"></div>
</template>
