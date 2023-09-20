<script setup>
import Welcome from '@/components/home/Welcome.vue'
import InfoSection from '@/components/home/InfoSection.vue'
import Footer from '@/components/Footer.vue'
import UserHomeView from '@/views/UserHomeView.vue'
import { useUserStore } from '@/stores/UserStore'
import Navigation from '@/components/navbar/Navbar.vue'

const userStore = useUserStore()
</script>

<template>
  <main v-if="!userStore.loggedIn">
    <Navigation />
    <Welcome />
    <InfoSection />
  </main>
  <footer v-if="!userStore.loggedIn">
    <Footer />
  </footer>
  <UserHomeView v-else />
</template>
