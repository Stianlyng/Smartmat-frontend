<script setup>
import Settings from '@/components/settings/SettingsMain.vue'
import { useUserStore } from '@/stores/UserStore.js'

const userStore = useUserStore()
</script>

<template>
  <main>
    <Settings v-if="userStore.loggedIn" />
  </main>
</template>
